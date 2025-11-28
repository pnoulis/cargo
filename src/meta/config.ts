export const CARGO_DIST_ID = "cargo";

/*
  XDG base directory specification
  https://specifications.freedesktop.org/basedir/latest/
*/
export const XDG_DATA_HOME = () => process.env.XDG_DATA_HOME || `${process.env.HOME}/.local/share`;
export const XDG_CACHE_HOME = () => process.env.XDG_CACHE_HOME || `${process.env.HOME}/.config`;
export const XDG_STATE_HOME = () =>
  process.env.XDG_STATE_HOME || `${process.env.HOME}/.local/state`;
export const XDG_DATA_DIRS = () => process.env.XDG_DATA_DIRS || "/usr/local/share/:/usr/share";
export const XDG_CONFIG_DIRS = () => process.env.XDG_CONFIG_DIRS || "/etc/xdg";

/*
  GNU installation directories
  https://www.gnu.org/prep/standards/standards.html#Directory-Variables
 */
export const PREFIX = process.env.BUILDIR || process.cwd();
export const BINDIR = `${PREFIX}/bin`;
export const DATAROOTDIR = `${PREFIX}/share`;
export const DATADIR = `${DATAROOTDIR}`;
export const LOCALSTATEDIR = `${PREFIX}/var`;
export const SYSCONFDIR = `${PREFIX}/etc`;

/*
  User directories
 */
export const CARGO_USER_SHAREDIR = (XDG_DATA_HOME) => `${XDG_DATA_HOME}/${CARGO_DIST_ID}`;
export const CARGO_USER_CACHEDIR = (XDG_CACHE_HOME) => `${XDG_CACHE_HOME}/${CARGO_DIST_ID}`;
export const CARGO_USER_STATEDIR = (XDG_STATE_HOME) => `${XDG_STATE_HOME}/${CARGO_DIST_ID}`;

/*
  System directories
 */
export const CARGO_SYSTEM_CONFDIR = `${SYSCONFDIR}/${CARGO_DIST_ID}`;
export const CARGO_SYSTEM_CACHEDIR = `${LOCALSTATEDIR}/cache/${CARGO_DIST_ID}`;
export const CARGO_SYSTEM_STATEDIR = `${LOCALSTATEDIR}/lib/${CARGO_DIST_ID}`;
export const CARGO_SYSTEM_SHAREDIR = `${LOCALSTATEDIR}/lib/${CARGO_DIST_ID}/share`;
export const CARGO_SYSTEM_DATADIR = `${DATADIR}/${CARGO_DIST_ID}`;

/*
  Derived directories
 */
export const RENDER_EXPORT_BASENAME = "exports";
export const OPTION_CARGO_OUTPUT_DIR = () => "";
export const RENDER_EXPORT_DIR = (OPTION_CARGO_OUTPUT_DIR) =>
  process.env.MODE === "production"
    ? OPTION_CARGO_OUTPUT_DIR
      ? `${OPTION_CARGO_OUTPUT_DIR}/${RENDER_EXPORT_BASENAME}`
      : `${CARGO_SYSTEM_DATADIR}/${RENDER_EXPORT_BASENAME}`
    : PREFIX;
