package io.github.mosser.arduinoml.kernel.behavioral;

public class Timer {
    private int time;

    public Timer(int time) {
        this.time = time;
    }

    public int getTime() {
        return time;
    }

    public void setTime(int time) {
        this.time = time;
    }

    @Override
    public String toString() {
        return "Timer{" +
                "time=" + time +
                '}';
    }
}
