'use strict';

var Quadtree = function(box, max){
  this.box = box;
  this.children = null;
  this.value = null;
  this.max = max;
};

Quadtree.prototype.insert = function(point, object){
  //check if should contain x, y
  //need to check if point already exists
  if (!this.box.containsPoint(point)){
    return this;
  }
  //if is a root node and not full, then insert
  if (this.children === null && this.value === null){
    this.value = [{point: point, value:object}];
    return this;
  }
  //if is a root node but full, call subdivide and then insert on the child nodes
  if(this.children === null){
    //check to see if point is equal
    if(this.value[0].point.x === point.x && this.value[0].point.y === point.y){
      this.value[0].value = object;
    } else {
      this.subdivide();
    }
  }
  // if is not a root node, call insert on child nodes
  _.each(this.children, function(child, index, list){
    child.insert(point, object);
  });
  this.value = null;
  return this;
};

Quadtree.prototype.subdivide = function(){
  //use box quadrant method to create 4 new equal child quadrants
  this.children = this.box.split();
  _.each(this.children, function(child, i, container){
    container[i] = new Quadtree(child);
  });
  //try inserting each value into the new child nodes
  _.each(this.value, function(obj, index, list){
    _.each(this.children, function(child, ind, l){
      child.insert(obj.point, obj.value);
    }, this);
  }, this);
};

Quadtree.prototype.queryRange = function(box){
  //return all point/value pairs contained in range
  //if query area doesn't overlap this box, return
  debugger;
  if (!this.box.overlaps(box)){
    return [];
  }
  //if root node with contained value(s), then check against contained objects
  var intersection = [];
  if(this.value !== null){
    _.each(this.value, function(val){
      if(box.containsPoint(val.point)){
        intersection.push(val);
      }
    });
    return intersection;
  }

  //if has children, then make recursive call on children 
  if(this.children !== null){
    _.each(this.children, function(child){
      debugger;
      intersection = intersection.concat(child.queryRange(box));
    });
    return intersection;
  }

  //if root node without value then return
  return [];
};

Quadtree.prototype.queryPoint = function(point){
  //return point/value pair if tree contains point
  if (this.value !== null){
    if (this.value[0].point.x === point.x && this.value[0].point.y === point.y){
      return this.value[0].value;
    }
  }

  if (this.children !== null){
    var val = null;
    _.each(this.children, function(child){
      val = val || child.queryPoint(point);
    });
  }

  return null;
};

Quadtree.prototype.clear = function(){
  this.children = null;
  this.value = null;
};







