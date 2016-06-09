export default function (state = null, action) {
  switch (action.type) {
    case "DATA":
      return Object.assign({}, state, action.payload.data);
     }
  return state;
}
