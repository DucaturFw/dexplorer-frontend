export default function({ isHMR, app, store, route, params, redirect }) {
  const defaultNetwork = "eth";
  if (isHMR) return;
  const networks = ["eth", "btc", "eos", "neo", "ada"];
  const net = params.network || route.fullPath.split("/")[1];
  console.log("lang", net);
  console.log("param", params.network);
  console.log("full", route.fullPath);
  if (!net || networks.indexOf(net) === -1) {
    return redirect(`/${defaultNetwork}`);
  } else {
    store.dispatch("selectedChain", net);
  }
}
