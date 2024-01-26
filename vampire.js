class Vampire {
  constructor(name, yearConverted) {
    this.name = name;
    this.yearConverted = yearConverted;
    this.offspring = [];
    this.creator = null;
  }

  /** Simple tree methods **/

  // Adds the vampire as an offspring of this vampire
  addOffspring(vampire) {
    this.offspring.push(vampire);
    vampire.creator = this;
  }

  // Returns the total number of vampires created by that vampire
  get numberOfOffspring() {
    return this.offspring.length;
  }

  // Returns the number of vampires away from the original vampire this vampire is
  get numberOfVampiresFromOriginal() {
    let count = 0;
    let parent = this.creator;
    while (parent !== null) {
      count++;
      parent = parent.creator;
    }
    return count;
  };

  // Returns true if this vampire is more senior than the other vampire. (Who is closer to the original vampire)
  isMoreSeniorThan(vampire) {
    return (this.numberOfVampiresFromOriginal < vampire.numberOfVampiresFromOriginal);
  };

  /** Stretch **/

  // Returns the closest common ancestor of two vampires.
  // The closest common anscestor should be the more senior vampire if a direct ancestor is used.
  // For example:
  // * when comparing Ansel and Sarah, Ansel is the closest common anscestor.
  // * when comparing Ansel and Andrew, Ansel is the closest common anscestor.
  closestCommonAncestor(vampire) {
    let parent1 = this;
    let parent2 = vampire;
    
    let parent1FromOriginal = parent1.numberOfVampiresFromOriginal;
    let parent2FromOriginal = parent2.numberOfVampiresFromOriginal;

    while (parent1FromOriginal > parent2FromOriginal) {
      parent1 = parent1.creator;
      parent1FromOriginal--;
    }

    while (parent2FromOriginal > parent1FromOriginal) {
      parent2 = parent2.creator;
      parent2FromOriginal--;
    }

    //we should now have both parents at the same level in the ancestry
    while ((parent1 !== null) && (parent2 !== null) && (parent1 !== parent2)) {
      parent1 = parent1.creator;
      parent2 = parent2.creator;
    }

    return parent1;
  };

  /** Tree traversal methods **/

  findVampireIncludeChildren = function(callback) {
    if (callback(this)) {
      return this;
    } else {
      let foundVampire = null;
      for (const child of this.offspring) {
        foundVampire = child.findVampireIncludeChildren(callback)
        if (foundVampire) {
          return foundVampire;
        }
      }
      return null;
    };
  };

  // Returns the vampire object with that name, or null if no vampire exists with that name
  vampireWithName(name) {
    return this.findVampireIncludeChildren(x => x.name === name);
  };

  addNumberDescendents = function() {
    let count = 0;
    if (Array.isArray(this.offspring)) {
      count += this.offspring.length;
      for (const child of this.offspring) {
        count += child.addNumberDescendents();
      }
    }
    return count;
  };
  
  // Returns the total number of vampires that exist
  get totalDescendents() {
    return this.addNumberDescendents();
  };
  
  getVampireListIncludeChildren = function(callback) {
    let returnList = [];
    if (callback(this)) {
      returnList.push(this);
    };
    for (const child of this.offspring) {
      const childList = child.getVampireListIncludeChildren(callback);
      if (childList.length > 0) {
        returnList = returnList.concat(childList);
      }
    }
    return returnList;
  }

  // Returns an array of all the vampires that were converted after 1980
  get allMillennialVampires() {
    return this.getVampireListIncludeChildren(x => x.yearConverted > 1980);
  };
}

module.exports = Vampire;

