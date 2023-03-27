import { LiteGraph } from "litegraph.js";

export default () => {
  var categoriesToRemove = [
    "network",
    "audio",
    "midi",
    "geometry",
    "color",
    "graphics",
    "math3d",
    "widget",
    "graph",
    "input"
  ];
  var nodeTypeToRemove = [
    "basic/file",
    "basic/script",
    "basic/download",
    "basic/data_store",
    "basic/watch",
    "basic/console",
    "basic/alert"
  ]

  // Loop through all registered node classes and remove those in the specified categories
  for (var typeName in LiteGraph.Nodes) {
    var nodeClass = LiteGraph.Nodes[typeName];
    var category = nodeClass.category.toLowerCase();
    
    if (categoriesToRemove.indexOf(category) !== -1) {
      LiteGraph.unregisterNodeType(nodeClass);
    }else if(nodeTypeToRemove.indexOf(nodeClass.type) !== -1){
        LiteGraph.unregisterNodeType(nodeClass);
    }else {
        //console.log(nodeClass.type)
    }
  }
};
