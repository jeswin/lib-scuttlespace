import init from "./init";
import * as modules from "./modules";

export default async function() {
  await init();
  return {
    modules
  };
}
