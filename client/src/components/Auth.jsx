import React, { useState } from "react";
import Cookies from "universal-cookie";
import axios from "axios";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import { Flex, message, Upload } from "antd";
import signinImage from "../assets/signup.png";

const getBase64 = (img, callback) => {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result));
  reader.readAsDataURL(img);
};

const beforeUpload = (file) => {
  const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
  if (!isJpgOrPng) {
    message.error("只能上传JPG/PNG格式");
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error("Image must smaller than 2MB!");
  }
  return isJpgOrPng && isLt2M;
};

const initialState = {
  fullName: "",
  password: "",
  confirmpassword: "",
  phoneNumber: "",
  avatar: "",
};

const Auth = () => {
  const [form, setForm] = useState(initialState);
  const [isSignup, setIsSignup] = useState(true);
  const [imageUrl, setImageUrl] = useState();
  const [loading, setLoading] = useState(false);
  const handleChange = (e) => {
    if (e.file) {
      if (e.file.status === "uploading") {
        setLoading(true);
        return;
      }
      if (e.file.status === "done") {
        getBase64(e.file.originFileObj, (url) => {
          setLoading(false);
          setImageUrl(url);
          setForm({ ...form, avatar: url });
        });
      }
    } else {
      setForm({ ...form, [e.target.name]: e.target.value });
    }

    console.log(form);
  };

  const uploadButton = (
    <button
      style={{
        border: 0,
        background: "none",
      }}
      type="button"
    >
      {loading ? <LoadingOutlined /> : <PlusOutlined />}
      <div
        style={{
          marginTop: 8,
        }}
      >
        Upload
      </div>
    </button>
  );
  const handleSubmit = (e) => {
    e.preventDefault();

    console.log(form);
  };
  const switchMode = () => {
    setIsSignup((prevIsSignup) => !prevIsSignup);
  };

  return (
    <div className="auth__form-container">
      <div className="auth__form-container_fields">
        <div className="auth__form-container_fields-content">
          <p>{isSignup ? "注册" : "登录"}</p>
          <form onSubmit={handleSubmit}>
            <div className="auth__form-container_fields-content_input">
              <label htmlFor="fullName">用户名：</label>
              <input
                type="text"
                name="fullName"
                placeholder="请输入"
                onChange={handleChange}
                required
              />
            </div>

            {isSignup && (
              <div className="auth__form-container_fields-content_input">
                <label htmlFor="phoneNumber">手机号：</label>
                <input
                  type="text"
                  name="phoneNumber"
                  placeholder="请输入"
                  onChange={handleChange}
                  required
                />
              </div>
            )}
            {isSignup && (
              <div className="auth__form-container_fields-content_input">
                <label htmlFor="avatar" className="auth__form_label">
                  用户头像：
                </label>
                <Upload
                  name="avatar"
                  listType="picture-card"
                  className="avatar-uploader"
                  showUploadList={false}
                  action="https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload"
                  beforeUpload={beforeUpload}
                  onChange={handleChange}
                >
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt="avatar"
                      name="avatar"
                      style={{
                        width: "100%",
                      }}
                    />
                  ) : (
                    uploadButton
                  )}
                </Upload>
              </div>
            )}
            <div className="auth__form-container_fields-content_input">
              <label htmlFor="password">密码：</label>
              <input
                type="password"
                name="password"
                placeholder="请输入"
                onChange={handleChange}
                required
              />
            </div>

            <div className="auth__form-container_fields-content_input">
              <label htmlFor="confirmPassword">确认密码：</label>
              <input
                type="confirmPassword"
                name="password"
                placeholder="确认密码"
                onChange={handleChange}
                required
              />
            </div>
            <div className="auth__form-container_fields-content_button">
              <button type="button" onClick={handleSubmit}>
                {isSignup ? "注册" : "登录"}
              </button>
            </div>
          </form>

          <div className="auth__form-container_fields-account">
            <p>
              {isSignup ? "已经有账户了吗？" : "还没有账户 "}
              <span onClick={switchMode}>{isSignup ? "登录" : "注册"}</span>
            </p>
          </div>
        </div>
      </div>
      <div className="auth__form-container_image">
        <img src={signinImage} alt="登录" />
      </div>
    </div>
  );
};

export default Auth;
