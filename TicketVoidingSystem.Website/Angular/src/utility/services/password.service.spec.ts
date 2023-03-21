import { PasswordService } from './password.service';

describe('PasswordService', () => {
  let service: PasswordService;

  beforeEach(() => {
    service = new PasswordService();
  });

  [
    { parameter: "", expected: "A5176855768898427B81003799C881" },
    { parameter: "1234aa", expected: "56E8A2D78170E87C928E480797CC73" },
    { parameter: "123456", expected: "A51743627D9238C3997BABD76D7D75" },
    { parameter: "DoRemon@123*~|}", expected: "40C8462177293754D48085577DD975" },
    { parameter: "TenCharsXY", expected: "5CE7E2D7810B38E76B8A1758976C8F" },
    { parameter: "TwentyChars123456789", expected: "372896207662076C5E857A38A47986" },
    { parameter: "ThirtyChars1234567890123456789", expected: "468843718746882ABD743627E7CC73" },
    { parameter: "FourtyChars12345678901234567890123456789", expected: "27B82C2680424797A389A517488A8A" },
  ].forEach((dataSet) => {
  it('Cfs EnCode return expected result', () => {
    // Action
    const result = service.hash(dataSet.parameter);

    // Assert
    expect(result).toEqual(dataSet.expected);

    });
  });
});
