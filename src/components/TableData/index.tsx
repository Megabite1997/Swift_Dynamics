"use client";
import React, { FC, useEffect, useState } from "react";
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

export default function TableData() {
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
      title: "Name",
      render: (_, r) => `${r.firstname} ${r.lastname}`,
      sorter: (a, b) => {
        const nameA = a.firstname + " " + a.lastname;
        const nameB = b.firstname + " " + b.lastname;
        return nameA.localeCompare(nameB);
      },
      sortDirections: ["ascend", "descend"],
    },
    {
      title: "Gender",
      dataIndex: "gender",
      sorter: (a, b) => a.gender.localeCompare(b.gender),
    },
    {
      title: "Phone",
      render: (_, r) => `${r.phonePrefix}${r.phoneNumber}`,
      sorter: (a, b) => {
        const numA = parseInt(a.phonePrefix + a.phoneNumber, 10);
        const numB = parseInt(b.phonePrefix + b.phoneNumber, 10);
        return numA - numB;
      },
    },
    { title: "Nationality", dataIndex: "nationality" },
    {
      title: "Manage",
      dataIndex: "id",
      render: (id) => (
        <Space>
          <a
            onClick={() => {
              dispatch(loadEntryToForm(id));
              setEditing(id);
            }}
          >
            Edit
          </a>
          <a onClick={() => dispatch(deleteEntry(id))}>Delete</a>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <FormTable editingRow={editing} />

      <div style={{ marginTop: 24 }}>
        <Checkbox
          checked={selected.length === entries.length}
          onChange={(e) =>
            setSelected(e.target.checked ? entries.map((x) => x.id) : [])
          }
        >
          Select All
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
          DELETE
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
