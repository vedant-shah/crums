"use client";
import React, { useState, useEffect } from "react";
import { Card, CardDescription, CardTitle } from "@/components/ui/card";
import { useCart } from "react-use-cart";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Badge } from "./ui/badge";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "./ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { HiFire } from "react-icons/hi";

function MenuItem({ dish }) {
  const Chance = require("chance");
  const chance = Chance();
  const { toast } = useToast();
  const { addItem, items, updateItemQuantity, getItem } = useCart();
  const [dishPrice, setDishPrice] = useState(dish.price);
  const [showCustomizationDrawer, setShowCustomizationDrawer] = useState(false);
  const [chosenCustomization, setChosenCustomization] = useState(() => {
    let temp = {};
    if (dish.availableCustomizations) {
      Object.keys(dish.availableCustomizations).forEach((customization) => {
        temp[[customization]] = [];
      });
    }
    return temp;
  });

  const addItemToCart = () => {
    dish.id = chance.guid();
    addItem(dish);
    toast({
      title: "Success",
      description: "Item was successfully added to cart.",
      duration: 1500,
      variant: "success",
    });
  };

  useEffect(() => {
    setDishPrice(dish.price);
    if (dish.availableCustomizations) {
      let customizationTotal = dish.price;
      Object.keys(dish.availableCustomizations).forEach((customization) => {
        chosenCustomization[customization]?.forEach((element) => {
          customizationTotal +=
            dish.availableCustomizations[customization].values[element];
        });
      });
      setDishPrice(customizationTotal);
    }
  }, [chosenCustomization]);

  return (
    <>
      <Card className="flex p-2 my-3 max-w-[768px] lg-min-w-[768px]">
        <div className="w-[70%] ps-1 py-2 pe-3">
          <CardTitle className="mb-2">
            <div className="flex items-center justify-between w-full">
              {dish.isVeg ? (
                <img
                  src="https://img.icons8.com/color/480/vegetarian-food-symbol.png"
                  style={{ width: "15px", height: "15px" }}
                  className="mb-2 me-3"
                  alt=""
                />
              ) : (
                <Image
                  src="/non-veg.png"
                  style={{ width: "15px", height: "15px" }}
                  className="mb-2 me-3"
                  width={15}
                  height={15}
                  alt=""
                />
              )}
              <div className="flex items-center">
                <HiFire className="text-orange-600" />
                <h3 className="font-light leading-none tracking-tight ">
                  {dish.calories} KCal
                </h3>
              </div>
            </div>
            {dish.name}
          </CardTitle>
          <CardDescription className="font-medium leading-none tracking-tight">
            ₹ {dish.price}
          </CardDescription>
          <CardDescription className="mt-3 text-start">
            {dish.description}
          </CardDescription>
        </div>
        <div className="w-[30%] flex justify-end items-center relative">
          <Image
            src={dish.imgUrl}
            width={100}
            height={100}
            className={`object-cover rounded h-[100px] w-[100px] ${!dish.available && "filter grayscale"}`}
            alt="image"
          />
          {!dish.available && (
            <Badge className="absolute right-[5%] bottom-[5px]">
              Unavailable
            </Badge>
          )}
          {dish.available &&
            !dish.availableCustomizations &&
            items.filter((item) => item._id === dish._id).length === 0 && (
              <Button
                onClick={addItemToCart}
                className="absolute right-[15%] bottom-[5px]"
              >
                Add
              </Button>
            )}
          {!dish.availableCustomizations &&
            items.filter((item) => item._id === dish._id).length > 0 && (
              <div className="absolute right-[5%] bottom-[5px]">
                <Badge
                  onClick={() => {
                    updateItemQuantity(
                      items.filter((item) => item._id === dish._id)[0].id,
                      items.filter((item) => item._id === dish._id)[0]
                        .quantity - 1
                    );
                  }}
                  style={{ borderRadius: "5px 0 0 5px" }}
                >
                  -
                </Badge>
                <Badge
                  variant="secondary"
                  style={{ borderRadius: "0", backgroundColor: "black" }}
                >
                  {items.filter((item) => item._id === dish._id)[0]?.quantity}
                </Badge>
                <Badge
                  onClick={() => {
                    updateItemQuantity(
                      items.filter((item) => item._id === dish._id)[0].id,
                      items.filter((item) => item._id === dish._id)[0]
                        .quantity + 1
                    );
                  }}
                  style={{ borderRadius: "0 5px  5px 0" }}
                >
                  +
                </Badge>
              </div>
            )}
          {dish.available &&
            dish.availableCustomizations &&
            items.filter((item) => item._id === dish._id).length === 0 && (
              <Button
                className="absolute right-[15%] bottom-[5px]"
                onClick={() => setShowCustomizationDrawer(true)}
              >
                Add
              </Button>
            )}
          {dish.availableCustomizations && (
            <Drawer dismissible={false} open={showCustomizationDrawer}>
              <DrawerContent>
                <DrawerHeader>
                  <DrawerTitle>Customize as per your taste!</DrawerTitle>
                  <DrawerDescription>
                    {dish.name} ✦ ₹{dish.price} onwards.
                  </DrawerDescription>
                </DrawerHeader>
                <div className="p-4">
                  {Object.keys(dish.availableCustomizations).map(
                    (customization) => {
                      return (
                        <div className="my-4" key={customization}>
                          <h1 className="mt-2 font-bold">
                            {customization}
                            {dish.availableCustomizations[customization]
                              ?.allowed === 1 && "*"}
                          </h1>
                          <p className="mb-2 text-xs font-thin">
                            Choose any{" "}
                            {dish.availableCustomizations[customization]
                              ?.allowed === -1
                              ? ""
                              : dish.availableCustomizations[customization]
                                  ?.allowed}
                          </p>
                          {dish.availableCustomizations[customization]
                            ?.allowed === 1 && (
                            <RadioGroup className="gap-0">
                              {Object.keys(
                                dish.availableCustomizations[customization]
                                  .values
                              ).map((value) => {
                                return (
                                  <div key={value}>
                                    <div className="flex items-center my-1 space-x-2">
                                      <RadioGroupItem
                                        value={value}
                                        checked={chosenCustomization[
                                          customization
                                        ]?.includes(value)}
                                        id="r1"
                                        onClick={(e) => {
                                          if (!e.target.value) return;
                                          let temp =
                                            chosenCustomization[
                                              [customization]
                                            ];
                                          if (temp.length > 0) {
                                            temp.pop();
                                          }
                                          temp.push(e.target.value);
                                          setChosenCustomization({
                                            ...chosenCustomization,
                                            [[customization]]: temp,
                                          });
                                        }}
                                      />
                                      <div className="flex items-center justify-between w-[100%]">
                                        <Label htmlFor="r1">{value}</Label>
                                        <span>
                                          ₹{" "}
                                          {
                                            dish.availableCustomizations[
                                              customization
                                            ].values[value]
                                          }
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                );
                              })}
                            </RadioGroup>
                          )}
                          {dish.availableCustomizations[customization]
                            ?.allowed !== 1 &&
                            Object.keys(
                              dish.availableCustomizations[customization].values
                            ).map((value) => {
                              return (
                                <div key={value}>
                                  <div className="flex items-center my-2 space-x-2">
                                    <Checkbox
                                      value={value}
                                      id={value}
                                      checked={chosenCustomization[
                                        customization
                                      ]?.includes(value)}
                                      onClick={(e) => {
                                        if (
                                          dish.availableCustomizations[
                                            [customization]
                                          ].allowed !== -1 &&
                                          dish.availableCustomizations[
                                            [customization]
                                          ].allowed ===
                                            chosenCustomization[[customization]]
                                              .length &&
                                          !chosenCustomization[
                                            customization
                                          ]?.includes(value)
                                        ) {
                                          return;
                                        }
                                        let temp =
                                          chosenCustomization[[customization]];

                                        if (temp.includes(e.target.value)) {
                                          const index = temp.indexOf(
                                            e.target.value
                                          );
                                          temp.splice(index, 1);
                                          setChosenCustomization({
                                            ...chosenCustomization,
                                            [[customization]]: temp,
                                          });
                                          return;
                                        }
                                        temp.push(e.target.value);
                                        setChosenCustomization({
                                          ...chosenCustomization,
                                          [[customization]]: temp,
                                        });
                                      }}
                                    />
                                    <div className="flex items-center justify-between w-[100%]">
                                      <Label htmlFor={value}>{value}</Label>
                                      <span>
                                        ₹{" "}
                                        {
                                          dish.availableCustomizations[
                                            customization
                                          ].values[value]
                                        }
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          <Separator className="my-2" />
                        </div>
                      );
                    }
                  )}
                </div>
                <DrawerFooter className="flex flex-row" asChild>
                  <Button
                    variant="outline"
                    className="w-[50%]"
                    onClick={() => setShowCustomizationDrawer(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => {
                      let flag = false;
                      Object.keys(chosenCustomization).forEach((cus) => {
                        if (
                          dish.availableCustomizations[[cus]].allowed === 1 &&
                          chosenCustomization[[cus]].length !== 1
                        ) {
                          toast({
                            variant: "destructive",
                            title: "Please Fill All Required Fields",
                            description: "Required Fields are marked with an *",
                          });
                          flag = true;
                          return;
                        }
                      });
                      if (flag) return;
                      let copyOfDish = dish;
                      copyOfDish.id = chance.guid();
                      copyOfDish.price = dishPrice;
                      copyOfDish.chosenCustomization = chosenCustomization;
                      addItem(dish);
                      setShowCustomizationDrawer(false);
                      toast({
                        title: "Success",
                        description: "Item was successfully added to cart.",
                        duration: 1500,
                        variant: "success",
                      });
                    }}
                    className="w-[50%] font-bold"
                  >
                    Add |{" ₹"}
                    {dishPrice}
                  </Button>
                </DrawerFooter>
              </DrawerContent>
            </Drawer>
          )}
          {dish.availableCustomizations &&
            items.filter((item) => item._id === dish._id).length > 0 && (
              <div className="absolute right-[5%] bottom-[5px]">
                <Badge
                  onClick={() => {
                    updateItemQuantity(
                      items.filter((item) => item._id === dish._id)[0].id,
                      items.filter((item) => item._id === dish._id)[0]
                        .quantity - 1
                    );
                  }}
                  style={{ borderRadius: "5px 0 0 5px" }}
                >
                  -
                </Badge>
                <Badge
                  variant="secondary hover:disabled"
                  style={{ borderRadius: "0", backgroundColor: "black" }}
                >
                  {items.filter((item) => item._id === dish._id).length}
                </Badge>
                <Badge
                  onClick={() => {
                    setShowCustomizationDrawer(true);
                  }}
                  style={{ borderRadius: "0 5px  5px 0" }}
                >
                  +
                </Badge>
              </div>
            )}
        </div>
      </Card>
    </>
  );
}

export default MenuItem;
