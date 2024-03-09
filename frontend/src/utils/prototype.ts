/**
 * Function to display all properties in the prototype chain
 */
export const displayPropertiesInPrototypeChain = (obj: unknown) => {
  const properties: string[] = [];

  let currentObj = obj;
  while (currentObj) {
    const currentObjProperties = Object.getOwnPropertyNames(currentObj);
    properties.push(...currentObjProperties);

    currentObj = Object.getPrototypeOf(currentObj);
  }

  // Remove duplicates and display properties
  const uniqueProperties = [...new Set(properties)];
  return uniqueProperties;
};
