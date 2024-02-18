import mcloudSpinnerSvg from "./mcloud_spinner.svg";

export function McloudSpinner() {
  return (
    <div
      style={{
        background: "transparent",
        border: "none",
        textAlign: "center",
      }}
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
