import React, { FC, useState } from "react";
import { Row, Col, Button, Card, Flex } from "antd";
import { useTranslation } from "react-i18next";

import "./ShapesLayout.scss";

const shapes = [
  { className: "circle" },
  { className: "oval" },
  { className: "rectangle" },
  { className: "parallelogram" },
  { className: "square" },
  { className: "trapezoid" },
];

const ShapesLayout: FC = () => {
  const { t } = useTranslation();

  const [shapeList, setShapeList] = useState(shapes);

  const handleMoveShape = (direction: "left" | "right"): void => {
    if (shapes.length === 0) return;

    if (direction === "left") {
      const firstItem = shapeList[0];
      const newShapeList = shapeList.slice(1);
      newShapeList.push(firstItem);
      setShapeList(newShapeList);
    }

    if (direction === "right") {
      const lastItem = shapeList[shapeList.length - 1];
      const newShapeList = shapeList.slice(0, shapeList.length - 1);
      newShapeList.unshift(lastItem);
      setShapeList(newShapeList);
    }
  };

  const handleMovePosition = (): void => {
    if (shapeList.length === 0) return;

    const middleIndex = Math.floor(shapeList.length / 2);
    const topHalf = shapeList.slice(0, middleIndex);
    const bottomHalf = shapeList.slice(middleIndex);

    const newShapeList = [...bottomHalf, ...topHalf];
    setShapeList(newShapeList);
  };

  const handleRandomPosition = (): void => {
    if (shapeList.length === 0) return;

    const shuffledShapes = [...shapeList].sort(() => Math.random() - 0.5);
    setShapeList(shuffledShapes);
  };

  return (
    <div className="shapes-container">
      <Row gutter={[16, 16]}>
        <Col span={8}>
          <Card
            className="shape-wrapper"
            hoverable
            onClick={() => handleMoveShape("left")}
          >
            <div className="triangle-left"></div>
            <Button className="move-btn" type="primary">
              {t("Move shape")}
            </Button>
          </Card>
        </Col>

        <Col span={8}>
          <Card
            className="shape-wrapper"
            hoverable
            onClick={handleMovePosition}
          >
            <Flex align="center" justify="center">
              <div className="triangle-up"></div>
              <div className="triangle-down"></div>
            </Flex>
            <Button className="move-btn" type="primary">
              {t("Move position")}
            </Button>
          </Card>
        </Col>

        <Col span={8}>
          <Card
            className="shape-wrapper"
            hoverable
            onClick={() => handleMoveShape("right")}
          >
            <div className="triangle-right"></div>
            <Button className="move-btn" type="primary">
              {t("Move shape")}
            </Button>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        {shapeList.map((shape, index) => (
          <Col span={8} key={index}>
            <Card
              className="shape-wrapper"
              hoverable
              onClick={handleRandomPosition}
            >
              <div className={`shape ${shape.className}`} />
            </Card>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default ShapesLayout;
