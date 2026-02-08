const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");

const INPUT_FILE = path.join(__dirname, "input_countries.csv");
const CANADA_FILE = path.join(__dirname, "canada.txt");
const USA_FILE = path.join(__dirname, "usa.txt");

// 1) Deleting canada.txt and usa.txt if they already exist
function deleteIfExists(filePath) {
  try {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      console.log(`Deleted existing file: ${path.basename(filePath)}`);
    }
  } catch (err) {
    console.error(`Error deleting ${path.basename(filePath)}:`, err.message);
  }
}

deleteIfExists(CANADA_FILE);
deleteIfExists(USA_FILE);

// 2) Create write streams and write headers
const canadaStream = fs.createWriteStream(CANADA_FILE, { flags: "a" });
const usaStream = fs.createWriteStream(USA_FILE, { flags: "a" });

const header = "country,year,population\n";
canadaStream.write(header);
usaStream.write(header);

// 3) Reading CSV using stream + csv-parser, filter and write to files
let canadaCount = 0;
let usaCount = 0;

fs.createReadStream(INPUT_FILE)
  .on("error", (err) => {
    console.error("Failed to read input_countries.csv:", err.message);
  })
  .pipe(csv())
  .on("data", (row) => {
    // Normalize keys in case CSV uses different casing
    const country = (row.country || row.Country || "").toString().trim();
    const year = (row.year || row.Year || "").toString().trim();
    const population = (row.population || row.Population || "").toString().trim();

    const countryLower = country.toLowerCase();

    if (countryLower === "canada") {
      canadaStream.write(`${countryLower},${year},${population}\n`);
      canadaCount++;
    } else if (countryLower === "united states") {
      usaStream.write(`${countryLower},${year},${population}\n`);
      usaCount++;
    }
  })
  .on("end", () => {
    canadaStream.end();
    usaStream.end();

    console.log("Done.");
    console.log(`Canada rows written: ${canadaCount}`);
    console.log(`United States rows written: ${usaCount}`);
    console.log("Created files: canada.txt, usa.txt");
  });
