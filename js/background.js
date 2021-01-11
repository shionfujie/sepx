chrome.runtime.onMessageExternal.addListener(
  (request, sender, sendResponse) => {
    console.log(request);
    switch (request.type) {
      case "action spec":
        sendResponse({
          name: actionSpec.name,
          actions: Object.entries(actionSpec.actions).map(
            ([name, { displayName }]) => {
              return { name, displayName };
            }
          ),
        });
        break;
      case "execute action":
        const action = actionSpec.actions[request.action.name];
        if (action !== undefined) action.f();
        break
      case "select/response":
        if (request.cancelled || request.selected === undefined) return;
        console.log(request.selected);
        requestNavigateTo(request.selected);
        break;
    }
  }
);

const actionSpec = {
  name: "SEP",
  actions: {
    "fragment": {
      displayName: "SEP: Take the First Sentence",
      f: injectFragmentExtractor,
    },
  },
};

function injectFragmentExtractor() {
// chrome.tabs.executeScript({ file: "/js/fragment.js" })
    console.debug("Hello, SEPX")
}