
export function changeProperty (property) {
  return {
    type:'PROPERTY_CHANGE',
    payload:property
  };
}