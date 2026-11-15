import { Suspense } from "react";
import { Flex, Spinner, Text } from "@radix-ui/themes";
import Navbar from "@/app/components/Navbar/Navbar";
import DefaultHeading from "@/app/components/DefaultHeading/DefaultHeading";
import NewWorkoutContent from "./NewWorkoutContent";

export default function NewWorkout() {
  return (
    <div className="layout-page">
      <Navbar />
      <main className="layout-content">
        <DefaultHeading style={{ marginBottom: "1.25rem" }}>
          New Workout
        </DefaultHeading>
        <Suspense
          fallback={
            <Flex align="center" justify="center" gap="3" role="status">
              <Spinner />
              <Text>Loading workout...</Text>
            </Flex>
          }
        >
          <NewWorkoutContent />
        </Suspense>
      </main>
    </div>
  );
}
