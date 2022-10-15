import {
  Box,
  Button,
  ColorInput,
  Divider,
  Group,
  NumberInput,
  Stack,
  TextInput,
  Title,
} from "@mantine/core";
import { useEffect, useRef, useState } from "react";
import { useLocalStorage } from "@mantine/hooks";

export const App = () => {
  const [data, setData] = useLocalStorage({
    key: "score-data",
    defaultValue: {
      scale: 50,
      offset: 10,
      chroma: "#00ff00",
      text: "#ffffff",
      teams: [
        {
          name: "Home",
          color: "#3178c6",
          score: 0,
        },
        {
          name: "Away",
          color: "#f7df1e",
          score: 0,
        },
      ],
      clock: {
        period: 0,
        running: false,
      },
    },
  });
  const [minutes, setMinutes] = useState(40);
  const [seconds, setSeconds] = useState(0);
  const minuteRef = useRef(40);
  const secondRef = useRef(0);

  useEffect(() => {}, [minutes, seconds]);

  // Update clock when running
  useEffect(() => {
    if (!data.clock.running) return;

    console.log("update");

    const handle = setInterval(() => {
      if (secondRef.current === 0 && minuteRef.current === 0) {
        clearInterval(handle);

        setData({
          ...data,
          clock: {
            ...data.clock,
            running: false,
          },
        });

        return;
      }

      if (secondRef.current === 0) {
        setMinutes((old) => old - 1);
        setSeconds(59);
      } else setSeconds((old) => old - 1);
    }, 1000);

    return () => clearInterval(handle);
  }, [data.clock.running]);

  useEffect(() => {
    secondRef.current = seconds;
    minuteRef.current = minutes;
  }, [minutes, seconds]);

  return (
    <Box
      sx={{
        width: "100vw",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Box
        sx={{
          flexGrow: 1,
          padding: 16,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: data.text,
        }}
      >
        <Box
          sx={{
            height: "90%",
            aspectRatio: "16/9",
            backgroundColor: data.chroma,
            position: "relative",
          }}
        >
          <Box
            sx={{
              top: `${data.offset / 10}vw`,
              left: `${data.offset / 10}vw`,
              display: "flex",
              position: "absolute",
              transformOrigin: "top left",
              transform: `scale(${data.scale / 100})`,
            }}
          >
            <Box
              sx={{
                display: "flex",
              }}
            >
              {data.teams.map((team, i) => (
                <Box
                  key={i}
                  sx={{
                    width: "50%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    paddingTop: ".5vw",
                    paddingInline: ".75vw",
                    paddingBottom: ".25vw",
                    backgroundColor: team.color,
                  }}
                >
                  <Title
                    sx={{
                      fontSize: "1.5vw",
                      textTransform: "uppercase",
                    }}
                  >
                    {team.name}
                  </Title>
                  <Title
                    sx={{
                      fontSize: "3vw",
                      marginTop: "-.5vw",
                    }}
                  >
                    {team.score}
                  </Title>
                </Box>
              ))}
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Box
                sx={{
                  flexGrow: 1,
                  paddingInline: "1vw",
                  backgroundColor: "#505050",
                }}
              >
                <Title
                  sx={{
                    fontSize: "3.75vw",
                    marginBottom: "-.25vw",
                  }}
                >
                  {minutes.toString().padStart(2, "0")}:
                  {seconds.toString().padStart(2, "0")}
                </Title>
              </Box>
              <Box
                sx={{
                  paddingBlock: ".1vw",
                  alignContent: "center",
                  backgroundColor: "#222222",
                }}
              >
                <Title
                  sx={{
                    fontSize: "1vw",
                    textAlign: "center",
                    textTransform: "uppercase",
                  }}
                >
                  Period {data.clock.period}
                </Title>
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
      <Divider size={2} />
      <Group p={16} align="start" position="center">
        <Stack spacing={4}>
          <Title order={4}>Display Options</Title>
          <ColorInput
            label="Text Color"
            value={data.text}
            onChange={(value) => {
              setData({
                ...data,
                text: value!,
              });
            }}
          />
          <ColorInput
            label="Chroma Color"
            value={data.chroma}
            onChange={(value) => {
              setData({
                ...data,
                chroma: value!,
              });
            }}
          />
          <Group>
            <NumberInput
              label="Offset Percent"
              min={0}
              max={200}
              value={data.offset}
              onChange={(value) => {
                setData({
                  ...data,
                  offset: value!,
                });
              }}
            />
            <NumberInput
              label="Scale Percent"
              min={0}
              max={200}
              value={data.scale}
              onChange={(value) => {
                setData({
                  ...data,
                  scale: value!,
                });
              }}
            />
          </Group>
        </Stack>

        {data.teams.map((team, i) => (
          <Stack spacing={4}>
            <Title order={4}>Team {i + 1}</Title>
            <NumberInput
              label="Score"
              min={0}
              value={team.score}
              onChange={(value) => {
                const newData = { ...data };
                data.teams[i].score = value!;
                setData(newData);
              }}
            />
            <TextInput
              label="Name"
              value={team.name}
              onChange={(e) => {
                const newData = { ...data };
                data.teams[i].name = e.target.value;
                setData(newData);
              }}
            />
            <ColorInput
              label="Color"
              value={team.color}
              onChange={(value) => {
                const newData = { ...data };
                data.teams[i].color = value!;
                setData(newData);
              }}
            />
          </Stack>
        ))}
        <Stack spacing={4}>
          <Title order={4}>Clock</Title>
          <NumberInput
            value={data.clock.period}
            min={0}
            onChange={(value) =>
              setData({
                ...data,
                clock: { ...data.clock, period: value! },
              })
            }
            label="Game Period"
          />
          <Group>
            <NumberInput
              label="Minutes"
              min={0}
              value={minutes}
              onChange={(number) => setMinutes(number!)}
            />
            <NumberInput
              label="Seconds"
              min={0}
              value={seconds}
              onChange={(number) => setSeconds(number!)}
            />
          </Group>
          <Button
            mt={12}
            size="lg"
            color={data.clock.running ? "red" : "green"}
            onClick={() => {
              setData({
                ...data,
                clock: {
                  ...data.clock,
                  running: !data.clock.running,
                },
              });
            }}
          >
            {data.clock.running ? "Stop" : "Start"} Clock
          </Button>
        </Stack>
      </Group>
    </Box>
  );
};
