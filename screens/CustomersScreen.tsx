import { View, Text, ScrollView, ActivityIndicator } from "react-native";
import React, { useLayoutEffect, useState } from "react";
import { useTailwind } from "tailwind-rn/dist";
import {
  CompositeNavigationProp,
  useNavigation,
} from "@react-navigation/native";
import { BottomTabNavigationProp } from "@react-navigation/bottom-tabs";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { TabStackParamsList } from "../navigator/TabNavigator";
import { RootStackParamList } from "../navigator/RootNavigator";
import { Image, Input } from "@rneui/themed";
import CustomerCard from "../components/CustomerCard";
import { useQuery } from "@apollo/client";
import { GET_CUSTOMERS } from "../graphql/queries";

export type CustomersScreenNavigationProp = CompositeNavigationProp<
  BottomTabNavigationProp<TabStackParamsList, "Customers">,
  NativeStackNavigationProp<RootStackParamList>
>;

const CustomersScreen = () => {
  const tw = useTailwind();
  const navigation = useNavigation<CustomersScreenNavigationProp>();
  const [input, setInput] = useState<string>("");
  const { loading, error, data } = useQuery(GET_CUSTOMERS);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, []);
  return (
    <ScrollView style={{ backgroundColor: "#59C1CC" }}>
      <View>
        <Image
          source={{ uri: "https://links.papareact.com/3jc" }}
          containerStyle={tw("w-full h-64")}
          PlaceholderContent={<ActivityIndicator />}
        />
      </View>

      <Input
        placeholder="Search by customer"
        value={input}
        onChangeText={setInput}
        containerStyle={tw("bg-white pt-5 pb-0 px-10")}
      />
      {data?.getCustomers
        ?.filter((customer: CustomerList) => {
          return (
            customer.value.name.includes(input) ||
            customer.value.email.includes(input)
          );
        })
        .map(({ name: ID, value: { email, name } }: CustomerResponse) => (
          <CustomerCard key={ID} name={name} email={email} userId={ID} />
        ))}
    </ScrollView>
  );
};

export default CustomersScreen;
