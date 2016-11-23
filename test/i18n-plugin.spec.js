import { Tools, Provider } from '../lib/plugins/i18n-plugin'

describe('i18n-plugin Tools', () => {
  it('should be accessable', () => {
    expect(Tools).not.toBeNull();
  })

  it('should throw without appropriate params', () => {
    expect(() => {
      new Tools();
    }).toThrow();
  })

  it('can translate', () => {
    const TEST_KEY = "test_key"
    const TEST_VALUE = "测试值"

    const tools = new Tools({
      localeData: {
        domain: "messages",
        locale_data: {
          messages: {
            "": {
              "domain": "messages",
              "plural_forms": "nplurals=3; plural=(n%10==1 && n%100!=11 ? 0 : n%10>=2 && n%10<=4 && (n%100<10 || n%100>=20) ? 1 : 2);",
              "lang": ""
            },
            [TEST_KEY]: [
              TEST_VALUE
            ]
          }
        }
      }
    })

    expect( tools.l(TEST_KEY) ).toBe(TEST_VALUE)
  })
})

describe('i18n-plugin Provider', () => {

  it('should be accessable', () => {
    expect(Provider).not.toBeNull();
  })
})
