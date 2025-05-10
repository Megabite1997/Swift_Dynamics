"use client";

import { Layout, Select } from "antd";
import { useTranslation } from "react-i18next";
import ClientOnly from "@/components/ClientOnly";
import "./Header.scss";

const { Header } = Layout;

export default function AppHeader() {
  const { t, i18n } = useTranslation();

  const handleChangeLanguage = (lng: string): void => {
    i18n.changeLanguage(lng);
  };

  return (
    <ClientOnly>
      <Header className="header">
        <Select
          value={i18n.language}
          style={{ width: 120 }}
          onChange={handleChangeLanguage}
          options={[
            { value: "en", label: t("English") },
            { value: "th", label: t("Thai") },
          ]}
        />
      </Header>
    </ClientOnly>
  );
}
