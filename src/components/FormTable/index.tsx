"use client";
import "./FormTable.scss";
import React, { FC, useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import moment from "moment";
import {
  Form,
  Input,
  Select,
  DatePicker,
  Radio,
  Button,
  Space,
  Flex,
} from "antd";
import type { RootState, AppDispatch } from "@/redux/store";
import type { Entry } from "@/redux/formSlice";
import {
  updateForm,
  resetForm,
  addEntry,
  updateEntry,
  setEntries,
} from "@/redux/formSlice";

const { Option } = Select;

interface indexProps {
  editingRow: string | null;
}

const FormTable: FC<indexProps> = ({ editingRow }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const { formData } = useSelector((s: RootState) => s.form);
  const [editing, setEditing] = useState<string | null>(editingRow);
  const [form] = Form.useForm();
  const [segments, setSegments] = useState({
    segment1: "",
    segment2: "",
    segment3: "",
    segment4: "",
    segment5: "",
  });

  const countryCodes = [
    { value: "+66", label: "🇹🇭 +66" },
    { value: "+1", label: "🇺🇸 +1" },
    { value: "+33", label: "🇫🇷 +33" },
    { value: "+44", label: "🇬🇧 +44" },
    { value: "+61", label: "🇦🇺 +61" },
    { value: "+86", label: "🇨🇳 +86" },
    { value: "+81", label: "🇯🇵 +81" },
  ];

  const onValuesChange = (changed: any) => {
    console.log("changed: ", changed);

    const key = Object.keys(changed)[0];
    dispatch(updateForm({ field: key, value: changed[key] }));
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    segment: string,
  ) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value.length <= getMaxLength(segment)) {
      setSegments((prev) => ({
        ...prev,
        [segment]: value,
      }));
    }

    if (value.length === getMaxLength(segment)) {
      const nextElement = document.getElementById(
        `citizen-${parseInt(segment.slice(-1)) + 1}`,
      );
      if (nextElement) {
        (nextElement as HTMLInputElement).focus();
      }
    }
  };

  const getMaxLength = (segment: string) => {
    switch (segment) {
      case "segment1":
      case "segment5":
        return 1;
      case "segment2":
        return 4;
      case "segment3":
        return 5;
      case "segment4":
        return 2;
      default:
        return 4;
    }
  };

  const onFinish = () => {
    if (editing) {
      dispatch(updateEntry({ id: editing, ...formData }));
      setEditing(null);
    } else {
      dispatch(addEntry());
    }
    dispatch(resetForm());
    form.resetFields();
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const saved = JSON.parse(
        localStorage.getItem("entries") || "[]",
      ) as Entry[];
      dispatch(setEntries(saved));
    }
  }, [dispatch]);

  useEffect(() => {
    form.setFieldsValue({
      ...formData,
      birthday: formData.birthday ? moment(formData.birthday) : null,
      ...formData.citizenId,
    });
  }, [formData, form]);

  return (
    <div style={{ padding: 24 }}>
      <Form
        form={form}
        layout="horizontal"
        onValuesChange={onValuesChange}
        onFinish={onFinish}
        className="form-table"
      >
        <Flex style={{ gap: "50px" }}>
          <Form.Item
            name="title"
            label={t("Title")}
            rules={[{ required: true }]}
          >
            <Select style={{ width: 120 }} placeholder={t("Title")}>
              {[t("Mr"), t("Mrs"), t("Miss"), t("Ms")].map((v) => (
                <Option key={v} value={v}>
                  {v}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="firstname"
            label={t("Firstname")}
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="lastname"
            label={t("Lastname")}
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
        </Flex>

        <Flex style={{ gap: "50px" }}>
          <Form.Item
            name="birthday"
            label={t("Birthday")}
            rules={[{ required: true }]}
          >
            <DatePicker />
          </Form.Item>

          <Form.Item
            name="nationality"
            label={t("Nationality")}
            rules={[{ required: true }]}
          >
            <Select style={{ width: 200 }} placeholder="Nationality">
              <Option value="Thai">{t("Thai")}</Option>
              <Option value="Other">{t("Other")}</Option>
            </Select>
          </Form.Item>
        </Flex>

        <Form.Item
          name="citizenID"
          label={t("CitizenID")}
          rules={[{ required: true, message: "Citizen ID is required" }]}
        >
          <Space style={{ display: "flex", alignItems: "center" }}>
            <Input
              id="citizen-1"
              maxLength={1}
              value={segments.segment1}
              onChange={(e) => handleChange(e, "segment1")}
              style={{ width: "30px", textAlign: "center" }}
            />
            <label>-</label>
            <Input
              id="citizen-2"
              maxLength={4}
              value={segments.segment2}
              onChange={(e) => handleChange(e, "segment2")}
              style={{ width: "60px", textAlign: "center" }}
            />
            <label>-</label>
            <Input
              id="citizen-3"
              maxLength={5}
              value={segments.segment3}
              onChange={(e) => handleChange(e, "segment3")}
              style={{ width: "80px", textAlign: "center" }}
            />
            <label>-</label>
            <Input
              id="citizen-4"
              maxLength={2}
              value={segments.segment4}
              onChange={(e) => handleChange(e, "segment4")}
              style={{ width: "40px", textAlign: "center" }}
            />
            <label>-</label>
            <Input
              id="citizen-5"
              maxLength={1}
              value={segments.segment5}
              onChange={(e) => handleChange(e, "segment5")}
              style={{ width: "30px", textAlign: "center" }}
            />
          </Space>
        </Form.Item>

        <Form.Item
          name="gender"
          label={t("Gender")}
          rules={[{ required: true }]}
        >
          <Radio.Group>
            <Radio value="Male">{t("Male")}</Radio>
            <Radio value="Female">{t("Female")}</Radio>
            <Radio value="Unsex">{t("Unsex")}</Radio>
          </Radio.Group>
        </Form.Item>

        <Flex style={{ gap: "5px" }}>
          <Form.Item
            name="countryCode"
            label={t("Mobile Phone")}
            initialValue="+66"
          >
            <Select style={{ width: 120 }} options={countryCodes} />
          </Form.Item>
          <label>-</label>
          <Form.Item name="phoneNumber">
            <Input placeholder="Phone Number" style={{ width: "200px" }} />
          </Form.Item>
        </Flex>

        <Form.Item name="passport" label={t("Passport No")}>
          <Input style={{ width: 300 }} />
        </Form.Item>

        <Flex style={{ gap: "50px" }}>
          <Form.Item
            name="salary"
            label={t("Expected Salary")}
            rules={[{ required: true }]}
          >
            <Input style={{ width: 300 }} />
          </Form.Item>

          <Form.Item>
            <Space>
              <Button
                htmlType="button"
                onClick={() => {
                  dispatch(resetForm());
                  form.resetFields();
                  setEditing(null);
                }}
              >
                {t("Reset")}
              </Button>
              <Button type="primary" htmlType="submit">
                {editing ? t("Update") : t("Submit")}
              </Button>
            </Space>
          </Form.Item>
        </Flex>
      </Form>
    </div>
  );
};

export default FormTable;
