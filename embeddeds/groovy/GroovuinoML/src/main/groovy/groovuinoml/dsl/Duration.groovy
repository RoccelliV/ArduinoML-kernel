package groovuinoml.dsl
import groovy.transform.TupleConstructor;

@TupleConstructor
public class Duration implements Comparable<Duration> {
    Double amount;
    TimeUnit unit;
    public Duration(Double amount, TimeUnit unit) {
        this.amount = amount;
        this.unit = unit;
    }
    public Duration plus(Duration duration) {
        TimeUnit timeUnit = this.unit.multiplier < duration.unit.multiplier ? this.unit : duration.unit;
        return new Duration((this.amount * this.unit.multiplier + duration.amount * duration.unit.multiplier) / timeUnit.multiplier, timeUnit);
    }
    public Duration minus(Duration duration) {
        TimeUnit timeUnit = this.unit.multiplier < duration.unit.multiplier ? this.unit : duration.unit;
        return new Duration((this.amount * this.unit.multiplier - duration.amount * duration.unit.multiplier) / timeUnit.multiplier, timeUnit);
    }
    @Override
    public String toString() {
        return this.amount.toString() + this.unit.toString();
    }
    @Override
    public int compareTo(Duration o) {
        return new Double(this.amount * this.unit.multiplier).compareTo(o.amount * o.unit.multiplier);
    }
}