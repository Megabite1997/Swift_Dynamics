"use client";

import styles from "./page.module.css";
import ShapesLayout from "../../components/ShapesLayout/ShapesLayout";
import { useTranslation } from "react-i18next";
import { Flex, Button } from "antd";
import AppHeader from "@/components/Header";
import { useRouter } from "next/navigation";

export default function LayoutStylePage() {
  const { t } = useTranslation();
  const router = useRouter();

  const handleNavigateHome = () => {
    router.push("/");
  };

  return (
    <div className={styles.page}>
      <Flex justify="space-between" align="center" className={styles.header}>
        <h1>{t("Layout & Style")}</h1>

        <div className={styles.subheader}>
          <AppHeader />
          <Button onClick={handleNavigateHome}>{t("Home")}</Button>
        </div>
      </Flex>

      <ShapesLayout />
    </div>
  );
}
