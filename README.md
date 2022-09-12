# LEPROVI

With LEPROVI we can program visually, through nodes, which we can convert to code for languages such as Python and JavaScript.

# Use of LEPROVI

# Types of nodes

| node | value | # input | input | # output | output 
| :--- | :--- | :--- | :--- | :--- | :--- |
| Assign | var name [a-z]+ | 1 | any node | 1 | value
| ComOp | A comparison operator | 1 | N/A | 1 | value
| Else | number/string/object/function | 1 | node if | 1 | value
| For | number/string/object/function | 1 | number | 1 | value 
| | | 2 | number | |
| If | number/string/object/function | 1 | number/string | 1 | value
| | | 2 | node ComOp | 2 | If -> Else
| | | 3 | number/string | |
| Math Operations | type operation & value | 1 | number | 1 | operation result
| | | 2 | number | | |

