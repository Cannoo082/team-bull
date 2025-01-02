// regex for email validation
export function validateEmail(email) {
  return /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
    email
  );
}

// format a string so that characters passed as args are not included 
// and first letter of each splitted word is capitalized 
export function formatString(str, split = ["_"]) {
  // Create a regular expression from the split array
  const delimiters = new RegExp(split.map(d => d.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|'), 'g');
  
  // Insert a space before capital letters for PascalCase or camelCase
  const withSpaces = str.replace(/([a-z])([A-Z])/g, '$1 $2');

  // Split the string using the created regular expression and handle words
  return withSpaces
      .split(delimiters)
      .filter(word => word.length)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
}
