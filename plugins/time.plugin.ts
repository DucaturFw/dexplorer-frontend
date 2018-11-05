export default function(context) {
  if ((<any>process).client && !context.isHMR) {
    setInterval(() => {
      context.store.commit("now", new Date().getTime());
    }, 1000);
  }
}
