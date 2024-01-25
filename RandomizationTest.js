var sampleData = [
  { id: 1, name: "Animal 1", weight: 18, tumourVolume: 72 },
  { id: 2, name: "Animal 2", weight: 15, tumourVolume: 52 },
  { id: 3, name: "Animal 3", weight: 22, tumourVolume: 68 },
  { id: 4, name: "Animal 4", weight: 25, tumourVolume: 21 },
  { id: 5, name: "Animal 5", weight: 19, tumourVolume: 80 },
  { id: 6, name: "Animal 6", weight: 14, tumourVolume: 94 },
  { id: 7, name: "Animal 7", weight: 21, tumourVolume: 107 },
  { id: 8, name: "Animal 8", weight: 20, tumourVolume: 179 },
  { id: 9, name: "Animal 9", weight: 28, tumourVolume: 140 },
  { id: 10, name: "Animal 10", weight: 25, tumourVolume: 112 },
  { id: 11, name: "Animal 11", weight: 16, tumourVolume: 95 },
  { id: 12, name: "Animal 12", weight: 23, tumourVolume: 77 },
  { id: 13, name: "Animal 13", weight: 17, tumourVolume: 7 },
  { id: 14, name: "Animal 14", weight: 21, tumourVolume: 190 },
  { id: 15, name: "Animal 15", weight: 29, tumourVolume: 88 },
]

// Randomization is different from recaging
// Randomize into Groups -> Recage based on Groups
// Example 25 Animals -> 4 Groups of 5 (Control, Group A, Group B, Group C) and then 5 excluded
// Exclusion -> Do we just want hard and fast rules, or a way to reduce variation/standard deviation in the group
// Allow re-randomization and show Group Name | Population | Metric A Mean + Variance | Metric B Mean + Variance | Metric C Mean + Variance

// Open Question: When you say "Randomize by Weight" what does that mean?
// Three step process
//   Selection -> Grouping -> Caging

function debugLog(message) {
  console.log(`> ${message}`);
}

function errorLog(message) {
  console.log(`[error] ${message}`);
}

// Parameters 
//  metric (required): The key to use for selection
//  number (required): Desired number of results
//  min (optional): Filter out all items under this automatically
//  max (optional): Filter out all items over this automatically
// 
// Notes
//  All remaining items 
function selectionStep(srcData, options) {
  // Validate Inputs
  if (!Array.isArray(srcData)) { 
    errorLog("Data must be an array"); 
    return; 
  }

  if (options.metric === undefined) { 
    errorLog("Missing required option 'metric'"); 
    return; 
  }
  
  if (options.number === undefined) { 
    errorLog("Missing required option 'number'"); 
    return; 
  }

  let invalidEntries = 0;
  
  srcData.forEach(item => { 
    if (item[options.metric] === undefined) { invalidEntries++; } 
  });

  if (invalidEntries > 0) { 
    errorLog("One or more data entries are missing the metric field");
    return;
  }

  // Validation complete

  let min = options.min || Number.MIN_VALUE;
  let max = options.max || Number.MAX_VALUE;
  console.log(`\n## Running Selection on ${min} <= ${options.metric} <= ${max} with ${options.number} results`);

  let data = srcData.filter(item => {
    return item[options.metric] >= min && item[options.metric] <= max;
  });

  debugLog(`Filtered out ${srcData.length - data.length} entries outside of min/max`);

  if (data.length <= options.number) {
    debugLog(`Requested ${options.number} and we have ${data.length} after min/max filtering - so we are done`);
    return data;
  }

  let total = 0;
  data.forEach(item => { total += item[options.metric]; });

  let mean = total / data.length;
  debugLog(`Mean of remaining data for metric ${options.metric} is ${mean}`);

  data.forEach(item => { item._distFromMean = Math.abs(mean - item[options.metric]); });
  data.sort((a, b) => { return a._distFromMean - b._distFromMean; });
  data = data.slice(0, options.number);
  
  return data;
}

console.log("# Sample Data")
console.table(sampleData);

var result = selectionStep(sampleData, { metric: "tumourVolume", min: 50, max: 150, number: 10 });
console.table(result);

var result = selectionStep(sampleData, { metric: "tumourVolume", min: 50, max: 150, number: 5 });
console.table(result);

var result = selectionStep(sampleData, { metric: "tumourVolume", min: 60, max: 90, number: 10 });
console.table(result);

var result = selectionStep(sampleData, { metric: "tumourVolume", min: 50, max: 150, number: 3 });
console.table(result);

var result = selectionStep(sampleData, { metric: "weight", number: 10 });
console.table(result);
