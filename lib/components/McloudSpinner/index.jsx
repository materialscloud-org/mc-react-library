import mcloudSpinnerSvg from "./mcloud_spinner.svg";

export function McloudSpinner({ className = "", style, ...rest }) {
  return (
    <div
      className={className}
      style={{
        background: "transparent",
        border: "none",
        textAlign: "center",
        ...style,
      }}
      {...rest}
    >
      <img
        src={mcloudSpinnerSvg}
        alt="Materials Cloud spinner"
        style={{
          width: "100%",
          minWidth: "20px",
          maxWidth: "200px",
          height: "auto",
        }}
      />
    </div>
  );
}
