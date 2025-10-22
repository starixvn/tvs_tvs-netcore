import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatchDetailComponent } from './match-detail.component';
import { Product } from '../../../utility/constants/config';

describe('MatchDetailComponent', () => {
    let component: MatchDetailComponent;
    let fixture: ComponentFixture<MatchDetailComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({}).compileComponents();

        fixture = TestBed.createComponent(MatchDetailComponent);
        component = fixture.componentInstance;
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    describe('isBitCoinProduct', () => {
        it('should return true when product is BITCOIN', () => {
            // Arrange
            component.product = Product.BITCOIN;

            // Act
            const result = component.isBitCoinProduct();

            // Assert
            expect(result).toBe(true);
        });

        it('should return false when product is not BITCOIN', () => {
            // Arrange
            component.product = Product.SPORTS_BOOK;

            // Act
            const result = component.isBitCoinProduct();

            // Assert
            expect(result).toBe(false);
        });

        it('should return false when product is NUMBER_GAME', () => {
            // Arrange
            component.product = Product.NUMBER_GAME;

            // Act
            const result = component.isBitCoinProduct();

            // Assert
            expect(result).toBe(false);
        });

        it('should return false when product is VIRTUAL_SPORTS', () => {
            // Arrange
            component.product = Product.VIRTUAL_SPORTS;

            // Act
            const result = component.isBitCoinProduct();

            // Assert
            expect(result).toBe(false);
        });

        it('should return false when product is BET_BUILDER', () => {
            // Arrange
            component.product = Product.BET_BUILDER;

            // Act
            const result = component.isBitCoinProduct();

            // Assert
            expect(result).toBe(false);
        });
    });
});
