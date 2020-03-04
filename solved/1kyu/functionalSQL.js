Object.defineProperty(Array.prototype, "flat", {
  value: function(depth = 1) {
    return this.reduce(function(flat, toFlatten) {
      return flat.concat(
        Array.isArray(toFlatten) && depth > 1
          ? toFlatten.flat(depth - 1)
          : toFlatten
      );
    }, []);
  }
});

var query = function() {
  return {
    object: null,
    fnOrderBy: function(callback) {
      if (callback) this.object = this.object.sort((a, b) => callback(a, b));
    },
    fnHavingArray: [],
    fnHaving: function(...callback) {
      if (callback) {
        let result = [];
        callback.forEach(fn => {
          result = result.concat(this.object.filter(item => fn(item)));
        });
        this.object = result;
      }
    },
    fnGroupBy: function(...callback) {
      if (callback) {
        callback.forEach(fn => {
          if (this.object[0][1] instanceof Array) {
            function deepReduce(obj) {
              if (obj[0] instanceof Array) {
                return obj.map(val => {
                  return [val[0], deepReduce(val[1])];
                });
              } else {
                return obj.reduce((accumulator, currentItem) => {
                  let callbackValue = fn(currentItem);
                  if (
                    accumulator.filter(item => item[0] == callbackValue)
                      .length == 0
                  ) {
                    accumulator.push([callbackValue, [currentItem]]);
                  } else {
                    let i = accumulator.findIndex(
                      item => item[0] == callbackValue
                    );
                    accumulator[i][1].push(currentItem);
                  }
                  return accumulator;
                }, []);
              }
            }
            this.object = this.object.map(val => {
              return [val[0], deepReduce(val[1])];
            });
          } else {
            this.object = this.object.reduce((accumulator, currentItem) => {
              let callbackValue = fn(currentItem);
              if (
                accumulator.filter(item => item[0] == callbackValue).length == 0
              ) {
                accumulator.push([callbackValue, [currentItem]]);
              } else {
                let i = accumulator.findIndex(item => item[0] == callbackValue);
                accumulator[i][1].push(currentItem);
              }
              return accumulator;
            }, []);
          }
        });
      }
    },
    fnSelect: function(callback) {
      if (callback) return this.object.map(item => callback(item));
      return this.object;
    },
    fnWhereArray: [],
    fnWhere: function(...callback) {
      if (callback) {
        let result = [];
        callback.forEach(fn => {
          result = result.concat(this.object.filter(item => fn(item)));
        });
        this.object = result;
      }
    },
    select: function(callback) {
      if (typeof this.fnSelect.prototype === "undefined")
        throw new Error("Duplicate SELECT");
      this.fnSelect = this.fnSelect.bind(this, callback);
      return this;
    },
    from: function(...object) {
      if (this.object) throw new Error("Duplicate FROM");
      if (object.length > 1) {
        this.object = object[0]
          .map(obj0 => object[1].map(obj1 => [obj0, obj1]))
          .flat();
      } else {
        this.object = object.flat();
      }
      return this;
    },
    where: function(...callback) {
      if (callback)
        this.fnWhereArray.push(this.fnWhere.bind(this, ...callback));
      return this;
    },
    orderBy: function(callback) {
      if (typeof this.fnOrderBy.prototype === "undefined")
        throw new Error("Duplicate ORDERBY");
      this.fnOrderBy = this.fnOrderBy.bind(this, callback);
      return this;
    },
    groupBy: function(...callback) {
      if (typeof this.fnGroupBy.prototype === "undefined")
        throw new Error("Duplicate GROUPBY");
      this.fnGroupBy = this.fnGroupBy.bind(this, ...callback);
      return this;
    },
    having: function(...callback) {
      if (callback)
        this.fnHavingArray.push(this.fnHaving.bind(this, ...callback));
      return this;
    },
    execute: function() {
      if (!this.object) this.object = [];
      this.fnWhereArray.forEach(fn => fn());
      this.fnGroupBy();
      this.fnHavingArray.forEach(fn => fn());
      this.fnOrderBy();
      return this.fnSelect();
    }
  };
};
