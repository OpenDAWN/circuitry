(function (dagreD3, d3, document, window) {

  // Constants.
  var SVG_ID = '#circuitry-svg';

  
  // Graph engine.
  var g = new dagreD3.graphlib.Graph()
    .setGraph({ rankdir: 'LR' })
    .setDefaultEdgeLabel(function() { return {}; });

  // Set up an SVG group for translation.
  var svg = d3.select(SVG_ID),
      svgGroup = svg.append('g');

  // Create the renderer.
  var dagreRender = new dagreD3.render();


  // Circuitry render callback.
  function renderCallback() {
    // Global node styling.
    g.nodes().forEach(function(v) {
      var node = g.node(v);
      node.rx = node.ry = 5;
    });

    // Render content.
    dagreRender(svgGroup, g);

    // Centering graph.
    var width = g.graph().width;
    var height = g.graph().height;
    svg.attr('width', width + 20);
    svg.attr('height', height * 1.75);

    var centerX = (svg.attr('width') - width) / 2;
    var centerY = (svg.attr('height') - height) / 2;
    svgGroup.attr('transform', 'translate(' + centerX + ', ' + centerY +')');
  }


  // Event handlers.
  function onCreated(event) {
    // console.log('created', event.detail.source);
    var node = event.detail.source;
    var nodeRenderOptions = { labelType: 'html' };
    nodeRenderOptions.label = '<text>' + node.constructor.name + 
      '<br><span class="uid">' + node.uid + '</span></text>';
    nodeRenderOptions.class = node.constructor.name;
    g.setNode(node.uid, nodeRenderOptions);
    renderCallback();
  }

  function onDestoryed(event) {
    // TO FIX: Not feasible with JS implementation.
  }

  function onConnected(event) {
    var nodes = event.detail;
    g.setEdge(nodes.source.uid, nodes.destination.uid);
    renderCallback();
  }

  function onDisconnected(event) {
    var nodes = event.detail;
    g.removeEdge(nodes.source.uid, nodes.destination.uid);
    renderCallback();
  }

  document.addEventListener('aw-created', onCreated);
  document.addEventListener('aw-connected', onConnected);
  document.addEventListener('aw-disconnected', onDisconnected);

  window.onload = function () {
    var code = document.querySelector('#code');
    var codeview = document.querySelector('#codeview');
    codeview.innerHTML = '<pre>' + code.innerHTML + '</pre>';
  };

})(dagreD3, d3, document, window);