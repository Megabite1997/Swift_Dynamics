"use client";

import styles from "./page.module.css";
import { useTranslation } from "react-i18next";
import { Flex, Button } from "antd";
import { useRouter } from "next/navigation";

import AppHeader from "@/components/Header";
import TableData from "@/components/TableData";

export default function FormTablepage() {
  const { t } = useTranslation();
  const router = useRouter();

  const handleNavigateHome = () => {
    router.push("/");
  };

  return (
    <div>
      <Flex justify="space-between" align="center" className={styles.header}>
        <h1>{t("Form & Table")}</h1>

        <div className={styles.subheader}>
          <AppHeader />
          <Button onClick={handleNavigateHome}>{t("Home")}</Button>
        </div>
      </Flex>

      <TableData />
    </div>
  );
}
