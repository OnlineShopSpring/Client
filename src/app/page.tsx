"use client"
import { ChangeEvent, useEffect, useState } from "react";
import { IDiscount } from "../../public/model/IDiscount";
import { ICategory } from "../../public/model/ICategory";
import axios from "axios";
import { IProduct } from "../../public/model/IProduct";
import { storage } from './firebaseConfig';
import { listAll, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { v4 } from 'uuid';
import { log } from "console";

export default function Home() {
  const [nameProduct, setNameProduct] = useState<string>("");
  const [priceProduct, setPriceProduct] = useState<number | null>(null);
  const [discountProduct, setDiscountProduct] = useState<string | null>(null);
  const [quantityProduct, setQuantityProduct] = useState<string>("");
  const [categoryProduct, setCategoryProduct] = useState<string>();
  const [descriptionProduct, setDescriptionProduct] = useState<string>("");
  const [imageProduct, setImageProduct] = useState<string>("");
  const [category, setCategory] = useState<ICategory[]>([]);
  const [discount, setDiscount] = useState<IDiscount[]>([]);
  debugger
  const [products, setProducts] = useState<IProduct[]>([]);
  const [render, setRender] = useState<boolean>(true);

  const [imageUpload, setImageUpload] = useState<any>(null);
  const [ImageList, setImageList] = useState([]);
  const imageListRef = ref(storage, 'images/');

  useEffect(() => {
    (async () => {
      const token = localStorage.getItem("token");
      if (token) {
        const config = {
          headers: {
            Authorization: `Bearer ${token}`
          }
        };
        const response = await axios.get(`http://localhost:8080/categories`, config);
        setCategory(response.data);
      } else {
        console.log('Token không tồn tại trong localStorage.');
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      const token = localStorage.getItem("token");
      if (token) {
        const config = {
          headers: {
            Authorization: `Bearer ${token}`
          }
        };
        const response = await axios.get(`http://localhost:8080/discount`, config);
        setDiscount(response.data);
        // debugger
      } else {
        console.log('Token không tồn tại trong localStorage.');
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      const token = localStorage.getItem("token");
      if (token) {
        const config = {
          headers: {
            Authorization: `Bearer ${token}`
          }
        };
        const response = await axios.get(`http://localhost:8080/products`, config);
        setProducts(response.data.content);
      } else {
        console.log('Token không tồn tại trong localStorage.');
      }
    })();
  }, [render]);

  const handleSetName = (event: ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;
    setNameProduct(inputValue);
  }

  const handleSetPrice = (event: ChangeEvent<HTMLInputElement>) => {
    const inputValue = Number(event.target.value);
    setPriceProduct(inputValue);
  }

  const handleSetQuantity = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedOptionValue = event.target.value;
    setQuantityProduct(selectedOptionValue);
  }

  const handleSetDiscount = (event: ChangeEvent<HTMLSelectElement>) => {
    const selectedOptionValue = event.target.value;
    setDiscountProduct(selectedOptionValue);
  }
  const handleSetCategory = (event: ChangeEvent<HTMLSelectElement>) => {
    const selectedOptionValue = event.target.value;
    setCategoryProduct(selectedOptionValue);
  }

  const handleSetDescription = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const selectedOptionValue = event.target.value;
    setDescriptionProduct(selectedOptionValue);
  }

  const handleSetImage = async (event: any) => {
    var file = event.target.files[0];
    setImageUpload(file);
    // var reader = new FileReader();
    // reader.onloadend = function () {
    //   setImageProduct(reader.result);
    // }
    // reader.readAsDataURL(file);
  }


  const handleSendForm = async (event: React.MouseEvent<HTMLButtonElement>) => {
    const token = localStorage.getItem("token");
    if (token) {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };
      const imageRef = ref(storage, `images/${imageUpload?.name + v4()}`);
      uploadBytes(imageRef, imageUpload).then(data => {
        // console.log(data);
        // alert('ok');
        // console.log(getDownloadURL(imageRef));
        getDownloadURL(imageRef).then(async (data) => {
          const response = await axios.post(`http://localhost:8080/products`,
            {
              name: nameProduct,
              price: priceProduct,
              discount: {
                id: discountProduct
              },
              quantity: quantityProduct,
              descriptiong: descriptionProduct,
              category: {
                id: categoryProduct
              },
              image: data
            }
            , config);
          setRender(!render);
          debugger
        });
      });
    } else {
      console.log('Token không tồn tại trong localStorage.');
    }
  }

  const handleDeleteProducts = async (id: number) => {
    const token = localStorage.getItem("token");
    if (token) {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };
      const response = await axios.delete(`http://localhost:8080/products/${id}`, config);
      debugger
      setRender(!render);
    } else {
      console.log('Token không tồn tại trong localStorage.');
    }
  }

  return (
    <>
      <div
        className="modal fade"
        id="exampleModal"
        tabIndex={-1}
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">
                Thông tin sản phẩm
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              />
            </div>
            <div className="modal-body">
              <div>
                <div className="mb-3">
                  <label htmlFor="nameProduct" className="form-label">
                    Tên sản phẩm
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="nameProduct"
                    value={nameProduct}
                    onChange={handleSetName}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="priceProduct" className="form-label">
                    Đơn giá
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    id="priceProduct"
                    min={1}
                    onChange={handleSetPrice}
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="quantityProduct" className="form-label">
                    Số lượng
                  </label>
                  <input
                    type="number"
                    className="form-control"
                    id="quantityProduct"
                    min={1}
                    onChange={handleSetQuantity}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">
                    Loại giảm giá
                  </label>
                  <select className="form-select" aria-label="Default select example" onChange={handleSetDiscount}>
                    {discount.map((element, index) => (
                      <option key={element.id} value={element.id} selected={index == 0}>{element.percent}</option>
                    ))}
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label">
                    Loại sản phẩm
                  </label>
                  <select className="form-select" aria-label="Default select example" onChange={handleSetCategory}>
                    {category.map((element, index) => (
                      <option key={element.id} value={element.id} selected={index == 0}>{element.name}</option>
                    ))}
                  </select>
                </div>
                <div className="input-group mb-3">
                  <label className="input-group-text" htmlFor="inputGroupFile01">
                    Hình ảnh
                  </label>
                  <input type="file" className="form-control" id="inputGroupFile01" onChange={handleSetImage} />
                </div>
                <div className="mb-3">
                  <label htmlFor="description" className="form-label">
                    Thông tin mô tả
                  </label>
                  <textarea
                    className="form-control"
                    id="description"
                    rows={3}
                    defaultValue={""}
                    onChange={handleSetDescription}
                  />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Đóng
              </button>
              <button type="button" className="btn btn-primary"
                data-bs-dismiss="modal" onClick={handleSendForm}>
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      </div>

      <nav className="navbar navbar-dark bg-dark fixed-top">
        <div className="container-fluid">
          <a className="navbar-brand" href="#">
            Giao diện admin
          </a>

          <nav className="nav">
            <a className="nav-link active" aria-current="page" href="#">
              Active
            </a>
            <a className="nav-link" href="#">
              Link
            </a>
            <a className="nav-link" href="#">
              Link
            </a>
            <a className="nav-link">Disabled</a>
          </nav>


          <form className="d-flex" role="search">
            <input
              className="form-control me-2"
              type="search"
              placeholder="Search"
              aria-label="Search"
            />
            <button className="btn btn-success" type="submit">
              Search
            </button>
          </form>


          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="offcanvas"
            data-bs-target="#offcanvasDarkNavbar"
            aria-controls="offcanvasDarkNavbar"
          >
            <span className="navbar-toggler-icon" />
          </button>
          <div
            className="offcanvas offcanvas-end text-bg-dark bg-dark text-white"
            tabIndex={-1}
            id="offcanvasDarkNavbar"
            aria-labelledby="offcanvasDarkNavbarLabel"
          >
            <div className="offcanvas-header">
              <h5 className="offcanvas-title" id="offcanvasDarkNavbarLabel">
                Dark offcanvas
              </h5>
              <button
                type="button"
                className="btn-close btn-close-white"
                data-bs-dismiss="offcanvas"
                aria-label="Close"
              />
            </div>
            <div className="offcanvas-body">
              <ul className="navbar-nav justify-content-end flex-grow-1 pe-3">
                <li className="nav-item">
                  <a className="nav-link active" aria-current="page" href="#">
                    Home
                  </a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" href="#">
                    Link
                  </a>
                </li>
                <li className="nav-item dropdown">
                  <a
                    className="nav-link dropdown-toggle"
                    href="#"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    Dropdown
                  </a>
                  <ul className="dropdown-menu dropdown-menu-dark">
                    <li>
                      <a className="dropdown-item" href="#">
                        Action
                      </a>
                    </li>
                    <li>
                      <a className="dropdown-item" href="#">
                        Another action
                      </a>
                    </li>
                    <li>
                      <hr className="dropdown-divider" />
                    </li>
                    <li>
                      <a className="dropdown-item" href="#">
                        Something else here
                      </a>
                    </li>
                  </ul>
                </li>
              </ul>
              <form className="d-flex mt-3" role="search">
                <input
                  className="form-control me-2"
                  type="search"
                  placeholder="Search"
                  aria-label="Search"
                />
                <button className="btn btn-success" type="submit">
                  Search
                </button>
              </form>
            </div>
          </div>
        </div>
      </nav>
      <div className="container"></div>
      <div className="mt-5 text-white d-flex justify-content-end">
        <button className="btn btn-primary mt-3 me-4" data-bs-toggle="modal"
          data-bs-target="#exampleModal">Thêm mới</button>
      </div>
      <table className="table mt-3">
        <thead>
          <tr>
            <th scope="col">ID</th>
            <th scope="col">Tên SP</th>
            <th scope="col">Đơn giá</th>
            <th scope="col">Số lượng</th>
            <th scope="col">Giảm giá</th>
            <th scope="col">Danh mục</th>
            <th scope="col">Hình ảnh</th>
            <th scope="col">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {products.map(elemnt => (
            <tr>
              <th scope="row">{elemnt.id}</th>
              <td className="text-align">{elemnt.name}</td>
              <td>{elemnt.price}</td>
              <td>{elemnt.quantity}</td>
              <td>{elemnt.discount.percent}</td>
              <td>{elemnt.category.name}</td>
              <td><img src={elemnt?.image} style={{ width: 100 }} /></td>
              <td>
                <button className="btn btn-danger mx-1" onClick={() => handleDeleteProducts(elemnt?.id)}>Xóa</button>
                <button className="btn btn-primary">Chi tiết</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
