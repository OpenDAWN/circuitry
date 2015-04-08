(function (document) {

  'use strict';

  // Create unique ID for node.
  function _generateUID() {
    return 'xxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
      return v.toString(16);
    });
  }

  // Dispatch aw-event.
  function _dispatchEvent(eventType, srcNode, dstNode) {
    var event = new CustomEvent('aw-' + eventType, { 
      detail: { source: srcNode, destination: dstNode }
    });
    document.dispatchEvent(event);
  }

  // Wrap all the factory methods.
  function _wrapFactoryMethod(method) {
    AudioContext.prototype['_' + method] = AudioContext.prototype[method];
    AudioContext.prototype[method] = function () {
      var node = this['_' + method].apply(this, arguments);
      node.uid = _generateUID();
      node.context.nodes.push(node);
      _dispatchEvent('created', node);
      return node;
    };
  }

  for (var method in AudioContext.prototype) {
    if (method.indexOf('create') !== -1) {
      _wrapFactoryMethod(method);
    }
  }

  // Get node by UID.
  AudioContext.prototype.getNodeByID = function (uid) {
    for (var i = 0; i < this.nodes.length; i++) {
      if (this.nodes[i].uid === uid)
        return this.nodes[i];
    }
    return null;
  };

  // Wrap Connect.
  AudioNode.prototype._connect = AudioNode.prototype.connect;
  AudioNode.prototype.connect = function () {
    this._connect.apply(this, arguments);
    if (!this.context.connections[this.uid])
      this.context.connections[this.uid] = [];
    // TO FIX: check for AudioParam summing junction type.
    var dstNode = arguments[0];
    this.context.connections[this.uid].push(dstNode.uid);
    _dispatchEvent('connected', this, dstNode);
  };

  // Wrap disconnect.
  AudioNode.prototype._disconnect = AudioNode.prototype.disconnect;
  AudioNode.prototype.disconnect = function () {
    this._disconnect.apply(this, arguments);
    // TO FIX: generalize this for (target, inputIdx, outputIdx) signatures.
    // TO FIX: check for AudioParam summing junction type.
    var target = arguments[0];
    var connections = this.context.connections;
    if (connections.hasOwnProperty(this.uid)) {
      var index = connections[this.uid].indexOf(target.uid);
      if (index > -1) {
        connections[this.uid].splice(index, 1);
        _dispatchEvent('disconnected', this, target);
      }
    }
  };

  // Finally, wrap AudioContext.
  var _AudioContext = AudioContext;
  AudioContext = function () {
    var context = new _AudioContext();
    context.nodes = [];
    context.connections = {};
    context.destination.uid = _generateUID(); 
    context.nodes.push(context.destination);
    _dispatchEvent('created', context.destination);
    return context;
  };

})(document);