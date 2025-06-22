export default function IconButton({ sil }) {
  return (
    <i
      className="bi bi-trash fa-lg"
      style={{ cursor: "pointer" }}
      onClick={sil}
    ></i>
  );
}
