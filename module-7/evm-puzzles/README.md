# EVM puzzles

## Solutions Explantion

### Puzzle 1
```
00      34      CALLVALUE
01      56      JUMP
02      FD      REVERT
03      FD      REVERT
04      FD      REVERT
05      FD      REVERT
06      FD      REVERT
07      FD      REVERT
08      5B      JUMPDEST
09      00      STOP
```
This first puzzle is straighforward.

JUMPDEST is at position 8, so solution is 8.

<br>
<br>

### Puzzle 2
```
00      34      CALLVALUE
01      38      CODESIZE
02      03      SUB
03      56      JUMP
04      FD      REVERT
05      FD      REVERT
06      5B      JUMPDEST
07      00      STOP
08      FD      REVERT
09      FD      REVERT
```
The key here is the SUB operation done before the JUMP.
- JUMPDEST is at 6
- CODESIZE is 10.

Solution is 10 - 6 resulting in 4.

<br>
<br>

### Puzzle 3
```
00      36      CALLDATASIZE
01      56      JUMP
02      FD      REVERT
03      FD      REVERT
04      5B      JUMPDEST
05      00      STOP
```

JUMPDEST is at 4.

Solution is 4 set of bytes, 00000000.

<br>
<br>

### Puzzle 4
```
00      34      CALLVALUE
01      38      CODESIZE
02      18      XOR
03      56      JUMP
04      FD      REVERT
05      FD      REVERT
06      FD      REVERT
07      FD      REVERT
08      FD      REVERT
09      FD      REVERT
0A      5B      JUMPDEST
0B      00      STOP
```
The key here is the XOR operation done before the JUMP.
- JUMPDEST is at 0A which is base 16 of 10 with the binary representation of 1010.
- CODESIZE is 12 with the binary representation of 1100.

Working backwards with the bitwise XOR operation, 1100 with 0110 will result in 1010.

So the solution will be 6 with the binary representation of 0110.

<br>
<br>

### Puzzle 5
```
00      34          CALLVALUE
01      80          DUP1
02      02          MUL
03      610100      PUSH2 0100
06      14          EQ
07      600C        PUSH1 0C
09      57          JUMPI
0A      FD          REVERT
0B      FD          REVERT
0C      5B          JUMPDEST
0D      00          STOP
0E      FD          REVERT
0F      FD          REVERT
```
07 onwards is irrelevant to solving the puzzle as 07 will provide the right value for 09 to go to JUMPDEST. The key here is getting past EQ for the rest of the lines to run through.
- EQ is checking against the value 0100 at 03. 0100 is base 16 of 256.
- MUL is multiplying the DUP1 with CALLVALUE, DUP1 is the duplicate of CALLVALUE which means MUL result is the square of CALLVALUE.

The solution is the square root of 256 which is 16.

<br>
<br>


### Puzzle 6
```
00      6000      PUSH1 00
02      35        CALLDATALOAD
03      56        JUMP
04      FD        REVERT
05      FD        REVERT
06      FD        REVERT
07      FD        REVERT
08      FD        REVERT
09      FD        REVERT
0A      5B        JUMPDEST
0B      00        STOP
```
CALLDATALOAD loads a specific piece of data from the calldata at the position of 00 derived from PUSH1.

Since the calldata is a data of 32 byte length and JUMPDEST is at 0A, the solution is 000000000000000000000000000000000000000000000000000000000000000A.

<br>
<br>

### Puzzle 7
```
00      36        CALLDATASIZE
01      6000      PUSH1 00
03      80        DUP1
04      37        CALLDATACOPY
05      36        CALLDATASIZE
06      6000      PUSH1 00
08      6000      PUSH1 00
0A      F0        CREATE
0B      3B        EXTCODESIZE
0C      6001      PUSH1 01
0E      14        EQ
0F      6013      PUSH1 13
11      57        JUMPI
12      FD        REVERT
13      5B        JUMPDEST
14      00        STOP
```
The key here is to get past EQ.
- EXTCODESIZE needs to return 01 for EQ to be true. EXTCODESIZE is checking bytesize of return value from CREATE.
- CREATE takes in and execute an init code and returns the value resulting from the execution.
- CALLDATACOPY pushes the init code into memory allowing CREATE to take it in.

Solution is 60016000f3 which is equivalent to the following:
 - PUSH1 0x01
 - PUSH1 0x00
 - RETURN

<br>
<br>

### Puzzle 8
```
00      36        CALLDATASIZE
01      6000      PUSH1 00
03      80        DUP1
04      37        CALLDATACOPY
05      36        CALLDATASIZE
06      6000      PUSH1 00
08      6000      PUSH1 00
0A      F0        CREATE
0B      6000      PUSH1 00
0D      80        DUP1
0E      80        DUP1
0F      80        DUP1
10      80        DUP1
11      94        SWAP5
12      5A        GAS
13      F1        CALL
14      6000      PUSH1 00
16      14        EQ
17      601B      PUSH1 1B
19      57        JUMPI
1A      FD        REVERT
1B      5B        JUMPDEST
1C      00        STOP
```
Similar to puzzle 7 but this time EQ checks requires value of 00. The key here is CALL, to return a value of 00, the execution of CALL needs to be reverted.
- The init code which CREATE is running should cause an exception in order for CALL to be reverted.

<br>
<br>

### Puzzle 9
```
00      36        CALLDATASIZE
01      6003      PUSH1 03
03      10        LT
04      6009      PUSH1 09
06      57        JUMPI
07      FD        REVERT
08      FD        REVERT
09      5B        JUMPDEST
0A      34        CALLVALUE
0B      36        CALLDATASIZE
0C      02        MUL
0D      6008      PUSH1 08
0F      14        EQ
10      6014      PUSH1 14
12      57        JUMPI
13      FD        REVERT
14      5B        JUMPDEST
15      00        STOP
```
The key here is EQ checking against the value, 08.
- MUL needs to return 08 from multiplying CALLVALUE and CALLDATASIZE.
- LT is comparing CALLDATASIZE which should be larger than 03.

Solution would be CALLDATASIZE of 4 bytes which is 00000000 and CALLVALUE of 2.

<br>
<br>

### Puzzle 10
```
00      38          CODESIZE
01      34          CALLVALUE
02      90          SWAP1
03      11          GT
04      6008        PUSH1 08
06      57          JUMPI
07      FD          REVERT
08      5B          JUMPDEST
09      36          CALLDATASIZE
0A      610003      PUSH2 0003
0D      90          SWAP1
0E      06          MOD
0F      15          ISZERO
10      34          CALLVALUE
11      600A        PUSH1 0A
13      01          ADD
14      57          JUMPI
15      FD          REVERT
16      FD          REVERT
17      FD          REVERT
18      FD          REVERT
19      5B          JUMPDEST
1A      00          STOP
```
- ADD is adding 0A which is base16 of 10 with CALLVALUE. With JUMPDEST at base16 of 19 which is a value of 25.
- ISZERO is checking a MOD value of 0. Given SWAP1, CALLDATASIZE should be dividable with no remainder.

Solution would be CALLVALUE of 15 resulted from 25 minus 10 and CALLDATASIZE of 3 bytes which is 000000.
