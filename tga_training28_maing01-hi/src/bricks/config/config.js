import Config from "../../config/config.js";

const TAG = Config.TAG + "Bricks.";

export default {
  ...Config,

  TAG,
  CSS: Config.CSS + "bricks-"
};
