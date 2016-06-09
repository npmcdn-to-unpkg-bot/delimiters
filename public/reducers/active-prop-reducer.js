export default function (state = 'quotationStart', action) {
  switch (action.type) {
    case "PROPERTY_CHANGE":
      return action.payload;
     }
  return state;
}
