import { DoiBadge } from "../DoiBadge";
import "./index.css";

const cx = (...classes) => classes.filter(Boolean).join(" ");

/**
 * McAppHeader
 *
 * Title block for the top of an app, as in the ACWF verification app: the
 * title with its DOIs underneath on the left, an optional logo on the right
 * and a rule below.
 *
 *   <McAppHeader
 *     title="SeeK-path: the k-path finder and visualizer"
 *     logo={`${import.meta.env.BASE_URL}seekpath.png`}  // URL, or any element
 *     dois={["10.1016/j.commatsci.2016.10.015"]}
 *   />
 *
 * Each DOI is a string or `{ doi, label, color }` (label defaults to "DOI").
 * Anything passed as children (e.g. a subtitle) goes between the title and
 * the DOIs.
 */
export function McAppHeader({
  title,
  logo,
  logoAlt = "",
  dois = [],
  children,
  className,
  classes = {},
  ...rest
}) {
  return (
    <header className={cx("mc-app-header", className, classes.root)} {...rest}>
      <div className="mc-app-header__text">
        <h1 className={cx("mc-app-header__title", classes.title)}>{title}</h1>
        {children}
        {dois.length > 0 && (
          <div className={cx("mc-app-header__dois", classes.dois)}>
            {dois.map((entry) => {
              const { doi, ...badge } =
                typeof entry === "string" ? { doi: entry } : entry;
              return <DoiBadge key={doi} doi={doi} {...badge} />;
            })}
          </div>
        )}
      </div>
      {logo &&
        (typeof logo === "string" ? (
          <img
            src={logo}
            alt={logoAlt}
            className={cx("mc-app-header__logo", classes.logo)}
          />
        ) : (
          logo
        ))}
    </header>
  );
}
