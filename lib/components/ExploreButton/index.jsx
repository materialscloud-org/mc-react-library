import "./index.css";
import AiidaLogo from "./aiida-logo-128.png";

const cx = (...classes) => classes.filter(Boolean).join(" ");

export function ExploreButton({
  explore_url,
  uuid,
  placement = "bottom",
  tooltip,
  className,
  classes = {},
  ...rest
}) {
  const url = `${explore_url}/details/${uuid}?nodeType=NODE`;

  return (
    <span className={cx("explore-button", className, classes.root)} {...rest}>
      <a
        href={url}
        target="_blank"
        rel="noreferrer"
        className={cx("explore-button__link", classes.link)}
      >
        <img
          src={AiidaLogo}
          alt="Explore provenance"
          className={cx("explore-button__logo", classes.logo)}
        />
      </a>
      <span
        role="tooltip"
        data-placement={placement}
        className={cx("explore-button__tooltip", classes.tooltip)}
      >
        {tooltip ?? (
          <>
            Browse provenance
            <br />
            {uuid}
          </>
        )}
      </span>
    </span>
  );
}
