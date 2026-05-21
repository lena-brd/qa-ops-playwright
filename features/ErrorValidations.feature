Feature: Ecommerce validation
  @ErrorValidation
  Scenario Outline: Scenario Outline name: Placing the order
    Given a login to Ecommerce2 application with "<username>" and "<password>"
    Then Verify error message is displayed

    Examples:
        | username             | password | 
        | rahulshettyacademy2  | Learning@830$3mK2 |
        | rahulshettyacademy   | Learning@830$3mK3 |