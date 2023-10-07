export class ComponentConstants {
    
    public screenWidth: number = window.screen.width;
    public screenHieght: number = window.screen.height;
    
    public getViewBoxWidth(multiplier: any = 0.7): number {
        return this.screenWidth * multiplier;
    }

    public getViewBoxHeight(multiplier: any = 0.5): number {
        return this.screenWidth * multiplier;
    }
    
}
