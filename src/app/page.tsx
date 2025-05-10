"use client";

import { useTranslation } from "react-i18next";
import styles from "./page.module.css";
import { Card, Space, Flex } from "antd";
import Link from "next/link";
import AppHeader from "@/components/Header";

export default function Home() {
  const { t } = useTranslation();

  return (
    <div>
      <AppHeader />

      <Flex justify="center" align="center" className={styles.page}>
        <Space direction="horizontal" size={16}>
          <Link href="/layout-style" passHref>
            <Card
              hoverable
              size="small"
              title={`${t("Test")} 1`}
              style={{ width: 300 }}
            >
              <p>{t("Layout & Style")}</p>
            </Card>
          </Link>

          <Link href="/connect-api">
            <Card
              hoverable
              size="small"
              title={`${t("Test")} 2`}
              style={{ width: 300 }}
            >
              <p>{t("Connect API")}</p>
            </Card>
          </Link>

          <Link href="/form-table">
            <Card
              hoverable
              size="small"
              title={`${t("Test")} 3`}
              style={{ width: 300 }}
            >
              <p>{t("Form & Table")}</p>
            </Card>
          </Link>
        </Space>
      </Flex>
    </div>
  );
}
