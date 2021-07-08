/*
 * SPDX-License-Identifier: Apache-2.0
 */

package org.hyperledger.fabric.samples.fabcar;

import java.util.Objects;

import org.hyperledger.fabric.contract.annotation.DataType;
import org.hyperledger.fabric.contract.annotation.Property;

import com.owlike.genson.annotation.JsonProperty;

@DataType()
public final class Car {

    @Property()
    private final String make;

    @Property()
    private final String model;

    @Property()
    private final String color;

    @Property()
    private final String owner;

    @Property()
    private final String panne;

    @Property()
    private final String reparation;

    @Property()
    private final Float coutreparation;

    @Property()
    private final Float coutvente;

    @Property()
    private final String dated;

    @Property()
    private final String datea;


    public String getMake() {
        return make;
    }

    public String getPanne() {
        return panne;
    }

    public String getDated() {
        return dated;
    }

    public String getDatea() {
        return datea;
    }
    
    public String getReparation() {
        return reparation;
    }

    public Float getCoutReparation() {
        return coutreparation;
    }

    public Float getCoutVente() {
        return coutvente;
    }

    public String getModel() {
        return model;
    }

    public String getColor() {
        return color;
    }

    public String getOwner() {
        return owner;
    }

    public Car(@JsonProperty("make") final String make, @JsonProperty("model") final String model,
            @JsonProperty("color") final String color, @JsonProperty("owner") final String owner,
            @JsonProperty("panne") final String panne,  @JsonProperty("reparation") final String reparation,
            @JsonProperty("coutreparation") final Float coutreparation, @JsonProperty("coutvente") final Float coutvente,
            @JsonProperty("dated") final String dated, @JsonProperty("datea") final String datea) {
        this.make = make;
        this.model = model;
        this.color = color;
        this.owner = owner;
        this.panne = panne;
        this.reparation = reparation;
        this.coutreparation = coutreparation;
        this.coutvente = coutvente;
        this.dated = dated;
        this.datea = datea;
    }

    @Override
    public boolean equals(final Object obj) {
        if (this == obj) {
            return true;
        }

        if ((obj == null) || (getClass() != obj.getClass())) {
            return false;
        }

        Car other = (Car) obj;

        return Objects.deepEquals(new String[] {getMake(), getModel(), getColor(), getOwner(), getPanne(), getReparation(), getCoutVente(), getCoutReparation(), getDated(), getDatea()},
                new String[] {other.getMake(), other.getModel(), other.getColor(), other.getOwner(), other.getPanne(), other.getReparation(), getCoutVente(), getCoutReparation(), getDated(), getDatea()});
    }

    @Override
    public int hashCode() {
        return Objects.hash(getMake(), getModel(), getColor(), getOwner(), getPanne(), getReparation(), getCoutVente(), getCoutReparation(), getDated(), getDatea());
    }

    @Override
    public String toString() {
        return this.getClass().getSimpleName() + "@" + Integer.toHexString(hashCode()) + " [make=" + make + ", model="
                + model + ", color=" + color + ", owner=" + owner + ", panne=" + panne + ", reparation=" + reparation + ", coutvente=" + coutvente + ", coutreparation=" + coutreparation + ", dated=" + dated + ", datea=" + datea + "]";
    }
}
