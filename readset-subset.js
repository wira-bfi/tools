function areArraysEqual(arr1, arr2) {
  if (arr1.length !== arr2.length) return false;

  const countMap1 = {};
  const countMap2 = {};

  for (const el of arr1) {
    countMap1[el] = (countMap1[el] || 0) + 1;
  }

  for (const el of arr2) {
    countMap2[el] = (countMap2[el] || 0) + 1;
  }

  for (const key in countMap1) {
    if (countMap1[key] !== countMap2[key]) return false;
  }

  return true;
}

function compareUniqueArrays(arr1, arr2) {
  const set1 = new Set(arr1);
  const set2 = new Set(arr2);

  const missingInArr1 = arr2.filter(item => !set1.has(item));
  const missingInArr2 = arr1.filter(item => !set2.has(item));
  const sameValues = arr1.filter(item => set2.has(item));

  return {
    missingInArr1, 
    missingInArr2, 
    sameValues     
  };
}


function mergeUniqueArrays(...arrays) {
  const merged = arrays.flat(); 
  const unique = [...new Set(merged)];
  return unique;
}

const readSetUW = [
  // copy paste from readSet UW. example:
  // "document.DocCustomerKtpName",
]

const readSetBPKB = [
  // copy paste from readSet UW. example:
  // "document.DocCustomerKtpName",
]

const readSetOptionalUW = [
  // copy paste from readSet Optional UW. example:
  // "document.DocCustomerKtpName",
]

const readSetOptionalBPKB = [
  // copy paste from readSet Optional BPKB. example:
  // "document.DocCustomerKtpName",

]

const writeSetUW = [
  // copy paste from writeSet UW. example:
  // "document.DocCustomerKtpName",
]
const writeSetBPKB = [
  // copy paste from writeSet BPKB. example:
  // "document.DocCustomerKtpName",
]

console.log("EQUAL", areArraysEqual(readSetUW, readSetBPKB))
console.log("COMPARING", compareUniqueArrays(readSetUW, readSetBPKB))
console.log("MERGING READSET OPTIONAL", JSON.stringify(mergeUniqueArrays(
  readSetOptionalUW, 
  readSetOptionalBPKB, 
  compareUniqueArrays(readSetUW, readSetBPKB).missingInArr1,
  compareUniqueArrays(readSetUW, readSetBPKB).missingInArr2,
).sort()))
console.log("MERGING WRITESET", JSON.stringify(mergeUniqueArrays(
  writeSetUW, 
  writeSetBPKB,
).sort()))