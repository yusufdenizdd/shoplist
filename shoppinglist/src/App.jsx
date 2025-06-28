import { useState, useEffect } from "react";
import Form from "react-bootstrap/Form";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Button from "react-bootstrap/Button";
import InputGroup from "react-bootstrap/InputGroup";
import ListGroup from "react-bootstrap/ListGroup";
import IconButton from "./IconButton";
import { nanoid } from "nanoid";
import JSConfetti from "js-confetti";
import Fuse from "fuse.js";

const shops = [
  {
    id: 1,
    name: "Migros",
  },
  {
    id: 2,
    name: "BİM",
  },
  {
    id: 3,
    name: "ŞOK",
  },
  {
    id: 4,
    name: "A101",
  },
  {
    id: 5,
    name: "File",
  },
];
const categories = [
  { id: 1, name: "Elektronik" },
  { id: 2, name: "Şarküteri" },
  { id: 3, name: "Oyuncak" },
  { id: 4, name: "Bakliyat" },
  { id: 5, name: "Fırın" },
];
const variants = [
  "primary",
  "secondary",
  "success",
  "danger",
  "warning",
  "info",
  "light",
  "dark",
];

function App() {
  const [products, setProducts] = useState([]);

  const [filteredProducts, setFilteredProducts] = useState([]);

  const [hasCelebrated, setHasCelebrated] = useState(false);
  const [spareProducts, setSpareProducts] = useState([]);
  console.log(spareProducts);
  useEffect(() => {
    const allBought = products.every((product) => product.isBought === true);
    if (
      products.length > 0 &&
      allBought &&
      !hasCelebrated &&
      isRadioBought !== "boughtedRadio"
    ) {
      const jsConfetti = new JSConfetti();

      jsConfetti.addConfetti();
      setHasCelebrated(true);
    }
    if (!allBought && hasCelebrated) {
      setHasCelebrated(false);
    }
  }, [products, hasCelebrated]);

  const [productInput, setProductInput] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedMarket, setSelectedMarket] = useState("");
  function deleteProduct(productToDelete) {
    setProducts(
      products.filter((product) => product.id !== productToDelete.id)
    );
  }
  function boughted(clickedProduct) {
    //console.log(products);
    const updatedProducts = products.map((product) =>
      product === clickedProduct
        ? { ...product, isBought: !product.isBought }
        : product
    );
    setProducts(updatedProducts);

    setSpareProducts(updatedProducts);
  }

  function addProducts() {
    if (!productInput || !selectedCategory || !selectedMarket) {
      setProductInput("");
      return;
    }
    const exists = products.some(
      (p) =>
        p.name == productInput &&
        p.shopId == selectedMarket &&
        p.categoryId == selectedCategory
    );
    if (exists) {
      setProductInput("");
      return;
    }
    const newProduct = {
      name: productInput,
      shopId: selectedMarket,
      categoryId: selectedCategory,
      isBought: false,
      id: nanoid(),
    };
    const updatedNewList = [...products, newProduct];
    setProducts(updatedNewList);
    setSpareProducts(updatedNewList);
    setProductInput("");
  }

  const [isRadioBought, setIsRadioBought] = useState("dontCareRadio");
  const [filteredShopId, setFilteredShopId] = useState("");
  const [filteredCategoryId, setFilteredCategoryId] = useState("");
  const [filteredName, setFilteredName] = useState("");
  const isFiltered =
    filteredName.trim() !== "" ||
    filteredShopId !== "" ||
    filteredCategoryId !== "" ||
    isRadioBought !== "dontCareRadio";

  console.log(isRadioBought, filteredShopId, filteredCategoryId, filteredName);
  const [debouncedName, setDebouncedName] = useState("");
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedName(filteredName);
    }, 500);

    return () => clearTimeout(timer);
  }, [filteredName]);

  useEffect(() => {
    let filtered = [...products];
    /*const copyProducts = spareProducts.map((p) => ({ ...p }));
    console.log(copyProducts);
    let filteredCopyProducts = copyProducts;*/
    const fuse = new Fuse(filtered, {
      keys: ["name"],
      threshold: 0.4,
    });
    filtered = debouncedName
      ? fuse.search(debouncedName).map((result) => result.item)
      : products;
    if (filteredShopId || filteredCategoryId || isRadioBought) {
      filtered = filtered.filter(
        (p) =>
          (!filteredShopId || p.shopId == filteredShopId) &&
          (!filteredCategoryId || p.categoryId == filteredCategoryId) &&
          (isRadioBought == "dontCareRadio" ||
            (isRadioBought == "boughtedRadio"
              ? p.isBought == true
              : isRadioBought == "notBoughtedRadio"
              ? p.isBought == false
              : null))
      );

      setFilteredProducts(filtered);
    }
    /*console.log(
        "filteredCopyProducts:",
        filteredCopyProducts,
        "filteredName:",
        filteredName,
        "filteredShopId:",
        filteredShopId,
        "filteredCategoryId:",
        filteredCategoryId
      );*/

    /*const button = document.getElementsByTagName("button")[0];
      isRadioBought == "dontCareRadio" && !filteredShopId && !filteredCategoryId
        ? (button.disabled = false)
        : (button.disabled = true);
    } else {
      const button = document.getElementsByTagName("button")[0];
      button.disabled = false;
      setProducts(copyProducts);
    }*/
  }, [
    products,
    debouncedName,
    filteredShopId,
    filteredCategoryId,
    isRadioBought,
  ]);

  return (
    <>
      <Container>
        <Row>
          <Form
            onSubmit={(e) => {
              e.preventDefault();
            }}
          >
            <Row className="gy-3">
              {" "}
              <h2 className="text-center mt-5">FİLTRELER</h2>
              <Col xs={6}>
                <Form.Group>
                  <Form.Select
                    value={filteredShopId}
                    onChange={(e) => {
                      setFilteredShopId(e.target.value);
                      //showFiltered();
                    }}
                  >
                    <option value="">Market Seçiniz</option>
                    {shops.map((shop, index) => (
                      <option key={index} value={shop.id}>
                        {shop.name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col xs={6}>
                <Form.Group>
                  <Form.Select
                    value={filteredCategoryId}
                    onChange={(e) => {
                      setFilteredCategoryId(e.target.value);
                      //showFiltered();
                    }}
                  >
                    <option value="">Kategori Seçiniz</option>
                    {categories.map((category, index) => (
                      <option key={index} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col xs={12} className="d-flex justify-content-between">
                {" "}
                <Form.Check // prettier-ignore
                  type="radio"
                  id="radio-1"
                  label="Satın alınanlar"
                  name="radioBought"
                  value="boughtedRadio"
                  checked={isRadioBought == "boughtedRadio"}
                  onChange={(e) => setIsRadioBought(e.target.value)}
                />{" "}
                <Form.Check // prettier-ignore
                  type="radio"
                  id="radio-2"
                  label="Satın alınmayanlar"
                  name="radioBought"
                  value="notBoughtedRadio"
                  checked={isRadioBought == "notBoughtedRadio"}
                  onChange={(e) => setIsRadioBought(e.target.value)}
                />{" "}
                <Form.Check // prettier-ignore
                  type="radio"
                  id="radio-3"
                  label="Tümü"
                  name="radioBought"
                  value="dontCareRadio"
                  checked={isRadioBought == "dontCareRadio"}
                  onChange={(e) => setIsRadioBought(e.target.value)}
                />
              </Col>
              <Col xs={12}>
                {" "}
                <Form.Group className="mb-3" controlId="filterinput">
                  <Form.Control
                    type="text"
                    placeholder="Ürün adı"
                    value={filteredName}
                    onChange={(e) => {
                      setFilteredName(e.target.value);
                      //showFiltered();
                    }}
                  />
                </Form.Group>
              </Col>
            </Row>
          </Form>
          <Col xs={12}>
            <h2 className="text-center mt-5">ALINACAKLAR LİSTESİ</h2>

            <ListGroup as="ul">
              {(isFiltered ? filteredProducts : products).map(
                (product, key) => (
                  <ListGroup.Item
                    as="li"
                    action
                    key={key}
                    variant={variants[key % variants.length]}
                    className="d-flex"
                    onClick={() => boughted(product)}
                    style={{
                      textDecoration: product.isBought
                        ? "line-through"
                        : "none",
                    }}
                  >
                    <span className="me-auto">{product.name}</span>{" "}
                    <span>
                      {shops.find((s) => s.id == product.shopId).name}
                      {"/"}
                      {
                        categories.find((c) => c.id == product.categoryId).name
                      }{" "}
                      <IconButton
                        sil={(e) => {
                          e.stopPropagation();
                          deleteProduct(product);
                        }}
                      />{" "}
                    </span>
                  </ListGroup.Item>
                )
              )}
            </ListGroup>
          </Col>
          <Col className="mt-5" xs={12}>
            <Form>
              <Form.Group className="mb-3" controlId="urun">
                <InputGroup>
                  <Form.Control
                    type="text"
                    placeholder="Ne alacaksın?"
                    value={productInput}
                    onChange={(e) => setProductInput(e.target.value)}
                  />
                  <Button
                    type="submit"
                    onClick={(e) => {
                      e.preventDefault();
                      addProducts();
                    }}
                  >
                    Sepete Ekle
                  </Button>
                </InputGroup>
              </Form.Group>
              <Row>
                <Col xs={6}>
                  <Form.Group>
                    <Form.Select
                      value={selectedMarket}
                      onChange={(e) => setSelectedMarket(e.target.value)}
                    >
                      <option value="">Market Seçiniz</option>
                      {shops.map((shop, index) => (
                        <option key={index} value={shop.id}>
                          {shop.name}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col xs={6}>
                  <Form.Group>
                    <Form.Select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                      <option value="">Kategori Seçiniz</option>
                      {categories.map((category, index) => (
                        <option key={index} value={category.id}>
                          {category.name}
                        </option>
                      ))}
                    </Form.Select>
                  </Form.Group>
                </Col>
              </Row>
            </Form>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default App;
