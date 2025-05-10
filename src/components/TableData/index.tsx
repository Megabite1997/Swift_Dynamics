"use client";
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";
import { Form, Button, Table, Checkbox, Space } from "antd";
import type { ColumnsType } from "antd/es/table";
import type { RootState, AppDispatch } from "@/redux/store";
import type { Entry } from "@/redux/formSlice";
import {
  deleteEntry,
  deleteMultiple,
  loadEntryToForm,
  setEntries,
} from "@/redux/formSlice";
import FormTable from "../FormTable";
import ClientOnly from "../ClientOnly";
import { useTranslation } from "react-i18next";

export default function TableData() {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const { formData, entries } = useSelector((s: RootState) => s.form);
  const [selected, setSelected] = useState<string[]>([]);
  const [editing, setEditing] = useState<string | null>(null);
  const [form] = Form.useForm();

  // Load stored entries only on client
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

  const columns: ColumnsType<Entry> = [
    {
      title: "",
      dataIndex: "id",
      render: (_, r) => (
        <Checkbox
          checked={selected.includes(r.id)}
          onChange={(e) => {
            const next = e.target.checked
              ? [...selected, r.id]
              : selected.filter((i) => i !== r.id);
            setSelected(next);
          }}
        />
      ),
    },
    {
      title: t("Name"),
      render: (_, r) => `${r.firstname} ${r.lastname}`,
      sorter: (a, b) => {
        const nameA = a.firstname + " " + a.lastname;
        const nameB = b.firstname + " " + b.lastname;
        return nameA.localeCompare(nameB);
      },
      sortDirections: ["ascend", "descend"],
    },
    {
      title: t("Gender"),
      dataIndex: "gender",
      sorter: (a, b) => a.gender.localeCompare(b.gender),
    },
    {
      title: t("Phone"),
      render: (_, r) => {
        return `${r.countryCode}${r.phoneNumber}`;
      },
      sorter: (a, b) => {
        const numA = parseInt(a.countryCode + a.phoneNumber, 10);
        const numB = parseInt(b.countryCode + b.phoneNumber, 10);
        return numA - numB;
      },
    },
    { title: t("Nationality"), dataIndex: "nationality" },
    {
      title: t("Manage"),
      dataIndex: "id",
      render: (id) => (
        <Space>
          <a
            onClick={() => {
              dispatch(loadEntryToForm(id));
              setEditing(id);
            }}
          >
            {t("Edit")}
          </a>
          <a onClick={() => dispatch(deleteEntry(id))}>{t("Delete")}</a>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <ClientOnly>
        <FormTable editingRowId={editing} setEditingRow={setEditing} />
      </ClientOnly>

      <div style={{ marginTop: 24 }}>
        <Checkbox
          checked={selected.length === entries.length}
          onChange={(e) =>
            setSelected(e.target.checked ? entries.map((x) => x.id) : [])
          }
        >
          {t("Select All")}
        </Checkbox>
        <Button
          danger
          onClick={() => {
            dispatch(deleteMultiple(selected));
            setSelected([]);
          }}
          disabled={!selected.length}
          style={{ marginLeft: 8 }}
        >
          {t("DELETE")}
        </Button>
      </div>

      <Table
        style={{ marginTop: 16 }}
        dataSource={entries}
        columns={columns}
        rowKey="id"
        pagination={{ pageSize: 5 }}
      />
    </div>
  );
}
