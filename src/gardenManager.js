export class GardenManager {
  constructor(flowerBeds, flowerRegions) {
    this.flowerSequence = { red: [], yellow: [] };
    this.currentIndex = { red: 0, yellow: 0 };
    this.flowerBeds = flowerBeds;
    this.flowerRegions = flowerRegions;
    this.setupFlowerSequence();
    console.log(`Garden Manager initialized: ${this}`);
  }

  setupFlowerSequence() {
    // Process each color
    for (const color of ['red', 'yellow']) {
      const colorKey = color === 'red' ? 1 : 2;
      let allPositions = [];
      const queued = new Set(); // positions already added by an earlier region

      // Go through each region
      this.flowerRegions[color].forEach((region, regionIndex) => {
        const boxes = Array.isArray(region[0]) ? region : [region]; // a region is one box or a list of boxes
        let regionPositions = [];

        // Collect all valid positions in this region
        for (const [xmin, xmax, ymin, ymax] of boxes) { // extract x/y coordinate ranges for each box
          for (let y = ymin - 1; y <= ymax - 1; y++) {
            for (let x = xmin - 1; x <= xmax - 1; x++) {
              const position = `${x},${y}`;
              // keep the cell if it matches the flower color key and no earlier region has queued it
              if (this.flowerBeds[y][x] === colorKey && !queued.has(position)) {
                queued.add(position);
                regionPositions.push({
                  position: position,
                  x: x,
                  y: y,
                  regionIndex: regionIndex
                });
              }
            }
          }
        }
        console.log(`Total number of valid positions for region #${regionIndex}: ${regionPositions.length}`);
        console.log(`Unshuffled positions for region #${regionIndex}: ${regionPositions}`);
        // Shuffle positions within this region
        for (let i = regionPositions.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [regionPositions[i], regionPositions[j]] = [regionPositions[j], regionPositions[i]];
        }
        console.log(`Shuffled positions for region #${regionIndex}: ${regionPositions}`);
        // Add to all positions
        allPositions = allPositions.concat(regionPositions);
      });

      // Flag cells of this color that no region covers (they could never be planted)
      const nCells = this.flowerBeds.flat().filter((v) => v === colorKey).length;
      if (allPositions.length < nCells) {
        console.warn(`${nCells - allPositions.length} of ${nCells} ${color} cells are not covered by any region`);
      }

      this.flowerSequence[color] = allPositions;
    }
  }

  getNextRose(color) {
    if (this.currentIndex[color] >= this.flowerSequence[color].length) {
      console.log("No more positions or regions available for this color rose");
      return null; // no more positions available
    }

    const nextPosition = this.flowerSequence[color][this.currentIndex[color]];
    this.currentIndex[color]++;

    return {
      x: nextPosition.x * 32,
      y: nextPosition.y * 32,
      regionIndex: nextPosition.regionIndex
    };
  }


}
