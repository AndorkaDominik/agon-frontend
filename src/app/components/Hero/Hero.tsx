"use client";

import {
  Box,
  Container,
  Flex,
  Grid,
  Separator,
  Text,
} from "@radix-ui/themes";
import styles from "./Hero.module.css";
import DefaultButton from "@/app/components/DefaultButton/DefaultButton";
import DefaultHeading from "@/app/components/DefaultHeading/DefaultHeading";
import { ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Hero() {
  const router = useRouter();

  return (
    <Box className={styles.heroRoot}>
      <Container 
        size="4" 
        py="9" 
        style={{ minHeight: "calc(100vh - 4rem)", display: "flex", flexDirection: "column", justifyContent: "center" }} 
        align="center"
      >
        <Grid
            columns="2" 
            width="auto"
            justify="between"
            align="center"
            height="100%"
        >
          <Flex
            direction="column"
            align={{ initial: "start", lg: "start" }}
            gap="6"
            className={styles.heroLeft}
          >
            <DefaultHeading
              size="9"
              className={styles.heroTitle}
              style={{letterSpacing: ".1rem"}}
            >
              TRACK YOUR
              <br />
              <span style={{color: "var(--accent-9)"}}>
                BEAST MODE
              </span>
            </DefaultHeading>

            <Text size="5" className={styles.heroDescription} style={{maxWidth: "42ch"}}>
              Log workouts, track progress, and discover how much raw power
              you're putting out. Every rep counts. Every lift matters.
            </Text>

            <Flex gap="4" wrap="wrap">
              <DefaultButton
                size="4"
                radius="none"
                variant="solid"
                fullWidth={false}
                icon={<ChevronRight />}
                iconPosition="right"
                onClick={() => router.push("/register")}
              >
                START TRAINING
              </DefaultButton>

              <DefaultButton
                size="4"
                radius="none"
                variant="outline"
                fullWidth={false}
                color="gray"
                highContrast
                onClick={() => router.push("/login")}
              >
                I Have an Account
              </DefaultButton>
            </Flex>
          </Flex>

          <Box className="card">
            <Flex direction="column" gap="4">
              <Box>
                <Text size="1" color="gray">
                  TODAY'S SESSION
                </Text>

                <DefaultHeading as="h2" size="8" weight="bold" mt="2" style={{color: "var(--accent-9)"}}>
                  PUSH DAY
                </DefaultHeading>
              </Box>

              <Flex direction="column" gap="3">
                {[
                  { name: "Bench Press", weight: "100 kg", reps: 8 },
                  { name: "Shoulder Press", weight: "60 kg", reps: 10 },
                  { name: "Incline Dumbbell", weight: "32 kg", reps: 12 },
                  { name: "Tricep Pushdown", weight: "50 kg", reps: 8 },
                ].map((exercise) => (
                  <Box key={exercise.name}>
                    <Flex justify="between" align="center" py="1">
                      <Text size="4" weight="light" color="gray">
                        {exercise.name}
                      </Text>

                      <Text size="4" weight="medium">
                        {exercise.weight} x {exercise.reps}
                      </Text>
                    </Flex>

                    <Separator size="4" />
                  </Box>
                ))}
              </Flex>

              <Separator size="4" style={{height: "4px"}} />

              <Flex
                direction={{ initial: "column", sm: "row" }}
                justify="between"
                align={{ initial: "start", sm: "end" }}
                gap="4"
              >
                <Box>
                  <Text size="2" color="gray">
                    Total Lifted
                  </Text>

                  <DefaultHeading as="h3" size="8" weight="bold" mt="2">
                    2,184 kg
                  </DefaultHeading>
                </Box>

                <DefaultHeading
                  size="8"
                  weight="bold"
                  className={styles.sessionMessage}
                >
                  YOU MOVED A RHINO!
                </DefaultHeading>
              </Flex>
            </Flex>
          </Box>
        </Grid>
      </Container>      
    </Box>
  );
}