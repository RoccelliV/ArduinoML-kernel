package groovuinoml.dsl;

public enum TimeUnit {
    millisecond("millisecond", 1.0), second("second", 1000.0), minute("minute", 60000.0);
    String abbreviation;
    Double multiplier;
    TimeUnit(String abbreviation, Double multiplier) {
        this.abbreviation = abbreviation;
        this.multiplier = multiplier;
    }

    public Double getMultiplier() {
        return multiplier;
    }

    @Override
    public String toString() {
        return this.abbreviation;
    }
}